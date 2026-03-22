const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const INSTANCE_ID = import.meta.env.VITE_INSTANCE_ID || "";
const INSTANCE_TOKEN = import.meta.env.VITE_INSTANCE_TOKEN || "";

const CHAT_PATH = "/api/v1/llm/chat/completions";

async function sha256Hex(message: string): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(
  key: string,
  message: string
): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateAuthHeaders(
  method: string,
  path: string,
  body: string
): Promise<Record<string, string>> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID();
  const bodyHash = await sha256Hex(body);
  const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyHash}`;
  const signature = await hmacSha256Hex(INSTANCE_TOKEN, message);

  return {
    "X-Instance-ID": INSTANCE_ID,
    "X-Timestamp": timestamp,
    "X-Nonce": nonce,
    "X-Signature": signature,
    "Content-Type": "application/json",
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export async function sendChatStream(
  messages: ChatMessage[],
  callbacks: StreamCallbacks,
  options?: {
    model?: string;
    temperature?: number;
    requestId?: string;
  }
): Promise<AbortController> {
  const controller = new AbortController();

  const requestId =
    options?.requestId ?? `chatcmpl-${crypto.randomUUID().slice(0, 12)}`;

  const body = JSON.stringify({
    request_id: requestId,
    model: options?.model ?? "qwen-plus",
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: options?.temperature ?? 0.7,
    stream: true,
  });

  const url = `${API_BASE_URL}${CHAT_PATH}`;
  const headers = await generateAuthHeaders("POST", CHAT_PATH, body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error ${response.status}: ${text}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              callbacks.onDone();
              return;
            }

            try {
              const chunk = JSON.parse(data);
              if (chunk.error) {
                callbacks.onError(new Error(chunk.error.message));
                return;
              }
              const content = chunk.choices?.[0]?.delta?.content;
              if (content) {
                callbacks.onToken(content);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
        callbacks.onDone();
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          callbacks.onError(err as Error);
        }
      }
    };

    processStream();
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      callbacks.onError(err as Error);
    }
  }

  return controller;
}

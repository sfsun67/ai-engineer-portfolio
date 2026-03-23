import { useState, useCallback, useRef } from "react";
import {
  sendChatStream,
  type ChatMessage,
} from "@/app/services/chatApi";
import { useLanguage } from "@/app/contexts/LanguageContext";

const SYSTEM_MESSAGE: ChatMessage = {
  role: "system",
  content:
    "你是一个 AI 工程师作品集网站的助手。你可以用中文或英文回答问题。帮助访客了解这个作品集中的项目、技术栈和作者的经验。回答简洁友好，保持专业。",
};

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      const assistantMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      // Build full message history for API
      const apiMessages: ChatMessage[] = [
        SYSTEM_MESSAGE,
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: trimmed },
      ];

      try {
        const controller = await sendChatStream(apiMessages, {
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id
                  ? { ...m, content: m.content + token }
                  : m
              )
            );
          },
          onDone: () => {
            setIsLoading(false);
          },
          onError: (error) => {
            const content =
              error.message === "RATE_LIMIT_EXCEEDED"
                ? t(
                    "每个 IP 每十分钟只能和我聊十句哦，欢迎联系我的 Email: sunshifeng67@foxmail.com",
                    "Each IP is limited to 10 messages per 10 minutes. Feel free to reach me at: sunshifeng67@foxmail.com"
                  )
                : `Error: ${error.message}`;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id ? { ...m, content } : m
              )
            );
            setIsLoading(false);
          },
        });
        abortRef.current = controller;
      } catch {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, stopGeneration, clearMessages };
}

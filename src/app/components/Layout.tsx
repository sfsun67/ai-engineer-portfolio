import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router";
import { Terminal, ChevronRight, Languages, X, Send, Square, Trash2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@/app/hooks/useChat";

export function Layout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { lang, setLang, t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage, stopGeneration, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-pixel-grid font-mono text-gray-800">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b-2 border-black pixel-shadow-sm mb-8 m-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2 overflow-hidden whitespace-nowrap">
            <div className="flex space-x-1.5 mr-4 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#E43B44] border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-[#F4D330] border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-[#4DA65C] border border-black"></div>
            </div>

            <nav className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
              <Link to="/" className="hover:text-[#1D79E4] flex items-center transition-colors">
                <Terminal className="w-4 h-4 mr-2 text-[#4DA65C]" />
                {t("~/作品集", "~/portfolio")}
              </Link>

              {pathnames.length > 0 && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
                  <span className="text-gray-500 truncate">{t("项目", "projects")}</span>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
                  <span className="text-[#F48B29] truncate">{pathnames[pathnames.length - 1]}</span>
                </>
              )}
            </nav>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase">
            <span>{t("[状态: 正常]", "[Status: OK]")}</span>
            <span className="text-[#4DA65C]">{t("info_v1.0", "Super_Individual_v1.0")}</span>
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 pixel-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] transition-all"
            >
              <Languages className="w-3 h-3" />
              {lang === "zh" ? "EN" : "中"}
            </button>
          </div>

          {/* Mobile language toggle */}
          <button
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            className="sm:hidden flex items-center gap-1 px-2 py-1 bg-white border-2 border-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 pixel-shadow-sm transition-all"
          >
            <Languages className="w-3 h-3" />
            {lang === "zh" ? "EN" : "中"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Outlet />
      </main>

      {/* Footer / Mascot & Chat */}
      <footer className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.1, x: 100, y: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.1, x: 100, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ originX: 1, originY: 1 }}
              className="mb-4 w-[309px] h-[500px] bg-white border-2 border-black pixel-shadow flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-black text-white px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest">AI Assistant</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearMessages}
                    className="hover:text-gray-400 transition-colors"
                    title={t("清空对话", "Clear chat")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col space-y-2">
                {/* Welcome message */}
                <div className="bg-[#4DA65C] text-white p-2 border-2 border-black self-start max-w-[85%] text-sm">
                  {t("你好！我是 Shifeng 的 AI 替身，有什么我可以帮你的吗？项目集还在建设中，有很多不完善的地方。最终我将采用渐进式披露的方案加载所有项目内容与你对话。", "Hello! I'm your AI assistant. How can I help you today?")}
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.role === "user"
                        ? "bg-[#1D79E4] text-white p-2 border-2 border-black self-end max-w-[85%] text-sm break-words"
                        : "bg-white text-gray-800 p-2 border-2 border-black self-start max-w-[85%] text-sm break-words whitespace-pre-wrap"
                    }
                  >
                    {msg.content || (isLoading && msg.role === "assistant" ? "..." : "")}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputValue.trim()) {
                    sendMessage(inputValue);
                    setInputValue("");
                  }
                }}
                className="p-2 border-t-2 border-black bg-white flex space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("输入消息...", "Type a message...")}
                  className="flex-1 text-xs p-1 border-2 border-black focus:outline-none"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="bg-[#E43B44] text-white p-1 border-2 border-black hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-black text-white p-1 border-2 border-black hover:bg-gray-800 transition-colors disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group cursor-pointer" onClick={() => setIsChatOpen(!isChatOpen)}>
          <AnimatePresence>
            {!isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-4 w-max bg-white text-xs border-2 border-black pixel-shadow-sm p-2 animate-pixel-float font-bold"
              >
                {t("想和我聊聊吗？", "Want to chat?")}
                {/* Speech bubble tail */}
                <div className="absolute top-full right-4 w-2 h-2 bg-white border-r-2 border-b-2 border-black transform rotate-45 -translate-y-1"></div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="w-12 h-12 bg-[#4DA65C] border-2 border-black pixel-shadow rounded-t-none rounded-b-lg flex items-center justify-center animate-pixel-shake hover:scale-110 transition-transform">
            <div className="w-8 h-2 bg-gray-800 absolute -top-2 rounded-t-md"></div>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full ml-0.5 mt-0.5"></div></div>
              <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full ml-0.5 mt-0.5"></div></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

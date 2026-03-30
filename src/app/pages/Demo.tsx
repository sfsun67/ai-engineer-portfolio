import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Code, ArrowLeft, Copy, CheckCircle2, Terminal } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { AgencyDemo } from "./demos/AgencyDemo";
import { AgentSystemDemo } from "./demos/agent-system";

export function Demo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyContact = () => {
    navigator.clipboard.writeText("sunshifeng67@foxmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      {/* Fake Demo Dashboard Wrapper */}
      <header className="bg-gray-900 text-white h-14 flex items-center px-6 justify-between border-b-4 border-[#E43B44]">
        <div className="flex items-center space-x-2 font-mono text-sm font-bold">
          <Terminal className="w-4 h-4 text-[#4DA65C]" />
          <span>{t("演示环境：", "Demo Environment: ")}{id}</span>
          <span className="bg-[#4DA65C] w-2 h-2 rounded-full animate-pulse ml-4" />
          <span className="text-[#4DA65C] font-normal">{t("在线", "LIVE")}</span>
        </div>
        <div className="flex space-x-3">
          <div className="w-3 h-3 bg-gray-600 rounded-full" />
          <div className="w-3 h-3 bg-gray-600 rounded-full" />
          <div className="w-3 h-3 bg-gray-600 rounded-full" />
        </div>
      </header>

      <main className="flex-1 flex p-6 gap-6 relative min-h-0">
        {id === "agency-personalities-trails" ? (
          <AgencyDemo />
        ) : id === "agent-system" ? (
          <AgentSystemDemo />
        ) : (
          <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-12 text-center text-gray-400 relative overflow-hidden">
             <div className="absolute inset-0 bg-pixel-grid opacity-10 pointer-events-none" />
             <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
               <div className="w-8 h-8 border-4 border-t-[#1D79E4] border-gray-300 rounded-full animate-spin"></div>
             </div>
             <h2 className="text-2xl font-bold text-gray-700 mb-2 font-mono">{t("正在加载沙箱...", "Loading Sandbox...")}</h2>
             <p className="max-w-md">{t("这是交互式演示的简约容器。实际的模拟数据与功能将在后续注入。", "This is a minimalist wrapper for the interactive demo. The actual mock data and functionality will be injected here later.")}</p>

             <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-lg opacity-50 pointer-events-none">
               <div className="h-32 bg-gray-100 rounded border border-gray-200"></div>
               <div className="h-32 bg-gray-100 rounded border border-gray-200"></div>
               <div className="h-24 bg-gray-100 rounded border border-gray-200 col-span-2"></div>
             </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mb-4 flex flex-col gap-3 items-end"
            >
              <button
                onClick={() => navigate(`/project/${id}`)}
                className="group flex items-center bg-white text-gray-800 px-4 py-2 text-sm font-bold border-2 border-black pixel-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-max"
              >
                {t("返回项目介绍", "Return to Intro")} <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                className="group flex items-center bg-[#1D79E4] text-white px-4 py-2 text-sm font-bold border-2 border-black pixel-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-max"
                onClick={() => window.open(id === "agency-personalities-trails" ? "https://github.com/sfsun67/Agency" : "https://github.com", "_blank")}
              >
                {t("查看源码", "View Source")} <Code className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={handleCopyContact}
                className="group flex items-center bg-[#F4D330] text-black px-4 py-2 text-sm font-bold border-2 border-black pixel-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-max"
              >
                {copied ? t("已复制！", "Copied!") : t("联系我", "Contact Me")}
                {copied ? <CheckCircle2 className="w-4 h-4 ml-2 text-green-600" /> : <Copy className="w-4 h-4 ml-2" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`relative w-16 h-16 rounded-full border-4 border-black bg-[#E43B44] pixel-shadow flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50`}
          aria-label="Toggle Menu"
        >
          <div className="absolute top-3 w-3 h-3 bg-white rounded-full left-3 border border-black flex items-center justify-center">
             <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          <div className="absolute top-3 w-3 h-3 bg-white rounded-full right-3 border border-black flex items-center justify-center">
             <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          <div className="absolute top-5 w-4 h-3 bg-[#F48B29] rounded-full border border-black shadow-sm" />
          <div className="absolute bottom-3 w-6 h-3 bg-black rounded-b-full overflow-hidden flex justify-center">
             <div className="w-3 h-2 bg-red-800 rounded-full mt-1" />
          </div>

          {!menuOpen && (
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D330] border-2 border-black rounded-full animate-bounce"></div>
          )}
        </button>
      </div>
    </div>
  );
}

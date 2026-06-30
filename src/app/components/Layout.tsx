import { Outlet, Link } from "react-router";
import { Terminal, Languages } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Layout() {
  const { lang, setLang, t } = useLanguage();

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Outlet />
      </main>

      <footer className="border-t-2 border-black bg-white/80 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1D79E4] hover:underline transition-colors"
            >
              粤ICP备2026081761号-1
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002014026"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#1D79E4] hover:underline transition-colors"
            >
              <img src="/beian-icon.png" alt="" className="h-4 w-4 shrink-0" />
              <span>粤公网安备44030002014026号</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

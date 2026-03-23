import { useState } from "react";
import { Link } from "react-router";
import { Code, Brain, Target, Rocket, ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

type Category = "all" | "algorithm" | "engineering" | "product" | "founder";

interface BiText {
  zh: string;
  en: string;
}

interface Project {
  id: string;
  title: BiText;
  description: BiText;
  categories: Category[];
  metrics: BiText[];
  theme: { bg: string; text: string; shadow: string };
  size: "large" | "medium" | "small";
}

const projects: Project[] = [
  {
    id: "agent-system",
    title: {
      zh: "AI广告视频混剪智能体系统（建设中...）",
      en: "AI Ad Video Agent System",
    },
    description: {
      zh: "独立设计面向Agent的执行运行时，结合上下文工程策略与工具链服务化，实现广告视频智能混剪全流程自动化。",
      en: "Independently designed an Agent-oriented execution runtime with context engineering and tool-chain services, automating the full pipeline of AI-driven ad video remixing.",
    },
    categories: ["algorithm", "engineering"],
    metrics: [
      { zh: "新增用户约万人", en: "~10K New Users" },
      { zh: "获客成本约30元", en: "~¥30 CAC" },
    ],
    theme: { bg: "bg-[#E43B44]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#E43B44]" },
    size: "large",
  },
  {
    id: "rag-engine",
    title: {
      zh: "AI内容运营全链路智能体系统（建设中...）",
      en: "AI Content Ops Agent System",
    },
    description: {
      zh: "基于Multi-Agent与多模态混合检索架构，实现广告文图素材自动化处理与社交媒体内容分发。",
      en: "Multi-Agent system with multimodal hybrid retrieval, automating ad asset processing and social media content distribution.",
    },
    categories: ["engineering", "product"],
    metrics: [
      { zh: "处理近万张素材", en: "~10K Assets Processed" },
      { zh: "日均400+条", en: "400+/day Throughput" },
    ],
    theme: { bg: "bg-[#1D79E4]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#1D79E4]" },
    size: "medium",
  },
  {
    id: "ai-bi",
    title: {
      zh: "AI短剧平台SkyReels（建设中...）",
      en: "AI Short Drama Platform SkyReels",
    },
    description: {
      zh: "昆仑万维出海AI短剧产品，负责多智能体系统设计、RAG系统构建及多模态训练数据建设。",
      en: "Kunlun's overseas AI short drama product. Led multi-agent system design, RAG construction, and multimodal training data pipelines.",
    },
    categories: ["product", "founder"],
    metrics: [
      { zh: "Agent系统60%代码", en: "60% Agent Codebase" },
      { zh: "上线北美地区", en: "Launched in NA" },
    ],
    theme: { bg: "bg-[#F4D330]", text: "text-gray-900", shadow: "hover:shadow-[6px_6px_0px_#F4D330]" },
    size: "medium",
  },
  {
    id: "eval-framework",
    title: {
      zh: "社会模拟多智能体系统（建设中...）",
      en: "Social Simulation Multi-Agent System",
    },
    description: {
      zh: "基于认知心理学的角色扮演与社会模拟系统，构建大规模场景数据用于模型对齐与推理增强。",
      en: "Cognitive psychology-based role-playing and social simulation system, generating large-scale scenario data for model alignment and reasoning enhancement.",
    },
    categories: ["algorithm", "founder"],
    metrics: [
      { zh: "1.8w+场景数据", en: "18K+ Scenarios" },
      { zh: "7B+模型性能↑90%", en: "7B+ Model +90%" },
    ],
    theme: { bg: "bg-[#F48B29]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#F48B29]" },
    size: "small",
  }
];

export function Home() {
  const [activeTab, setActiveTab] = useState<Category>("all");
  const { t, lang } = useLanguage();

  const bt = (bi: BiText) => (lang === "zh" ? bi.zh : bi.en);

  const filteredProjects = projects.filter(
    (p) => activeTab === "all" || p.categories.includes(activeTab)
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section 重构版 */}
      <section className="relative mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左侧：精炼的定位与介绍 */}
          <div className="lg:col-span-7 space-y-8">
            {/* 状态栏 - 移入此处以对齐右侧卡片顶部 */}
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center space-x-2 bg-[#E43B44] text-white px-3 py-1 font-bold text-sm uppercase tracking-wider border-2 border-black pixel-shadow-sm">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>{t("Available for Hire", "Available for Hire")}</span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-[#4DA65C] text-white px-3 py-1 font-bold text-sm uppercase tracking-wider border-2 border-black pixel-shadow-sm">
                <Code className="w-4 h-4" />
                <span>{t("站点构建中", "Building...")}</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 font-sans uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D79E4] via-[#4DA65C] to-[#F48B29]">
                {t("算法 × 工程 × 产品", "Algorithms × Engineering × Product")}
              </span>
            </h1>

            <p className="text-xl text-gray-600 font-sans leading-relaxed max-w-2xl">
              {t(
                "我不仅训练模型，更架构可落地的生产级系统、设计直觉化的用户体验，并交付真实的业务价值。从大模型科研到产品上线，具备完整AI实践路径。",
                "I don't just train models. I architect scalable production systems, design intuitive user experiences, and deliver real business impact. From LLM research to production-grade engineering."
              )}
            </p>

            <div className="flex items-center space-x-3 text-lg font-bold group">
              <div className="w-10 h-10 flex items-center justify-center bg-black text-white border-2 border-black pixel-shadow-sm group-hover:bg-[#1D79E4] transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <a href="mailto:sunshifeng67@foxmail.com" className="hover:underline decoration-2 underline-offset-4 transition-all">
                sunshifeng67@foxmail.com
              </a>
            </div>
          </div>

          {/* 右侧：将核心观点做成“宣言卡片” */}
          <div className="lg:col-span-5 relative group self-stretch">
            {/* 底部装饰性阴影块 */}
            <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 border-2 border-black"></div>
            
            {/* 宣言卡片本体 */}
            <div className="relative bg-[#F4D330] border-2 border-black p-8 h-full flex flex-col justify-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:-translate-x-1">
              <div className="absolute top-4 right-4 text-black/20 font-serif text-6xl font-black leading-none">"</div>
              
              <h3 className="font-bold text-sm uppercase tracking-widest border-b-2 border-black/20 pb-2 mb-4">
                {t("我的 AI 价值观", "My AI Manifesto")}
              </h3>
              
              <div className={`font-black text-gray-900 font-sans ${lang === 'zh' ? 'text-xl sm:text-2xl leading-snug' : 'text-lg sm:text-xl leading-tight tracking-tight'}`}>
                {t(
                  "AI 的下一个奇点不在于单纯的 Scaling Laws，而在于从单一模型能力，走向 Agent 系统的构建与人机交互的全面重构。",
                  "The next AI singularity lies not in scaling parameters, but in the shift from single-model capabilities to Agent systems and the complete redesign of HCI."
                )}
              </div>

              {/* 标签强调 */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="bg-white border-2 border-black text-xs font-bold px-2 py-1 uppercase pixel-shadow-sm">Multi-Model</span>
                <span className="bg-[#1D79E4] text-white border-2 border-black text-xs font-bold px-2 py-1 uppercase pixel-shadow-sm">Multi-Agent</span>
                <span className="bg-[#4DA65C] text-white border-2 border-black text-xs font-bold px-2 py-1 uppercase pixel-shadow-sm">System-Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-sans flex items-center">
          <Target className="w-6 h-6 mr-2 text-[#E43B44]" />
          {t("选择你的视角", "Choose Your Perspective")}
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black ${
              activeTab === "all" ? "bg-black text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 pixel-shadow-sm"
            }`}
          >
            {t("全部作品", "All Works")}
          </button>

          <button
            onClick={() => setActiveTab("algorithm")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "algorithm" ? "bg-[#1D79E4] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#1D79E4] pixel-shadow-sm"
            }`}
          >
            <Brain className="w-4 h-4" />
            {t("算法负责人", "Algorithm Lead")}
          </button>

          <button
            onClick={() => setActiveTab("engineering")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "engineering" ? "bg-[#4DA65C] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#4DA65C] pixel-shadow-sm"
            }`}
          >
            <Code className="w-4 h-4" />
            {t("工程负责人", "Engineering Lead")}
          </button>

          <button
            onClick={() => setActiveTab("product")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "product" ? "bg-[#F4D330] text-black pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#F4D330] pixel-shadow-sm"
            }`}
          >
            <Rocket className="w-4 h-4" />
            {t("产品/业务负责人", "Product / Biz Lead")}
          </button>

          <button
            onClick={() => setActiveTab("founder")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "founder" ? "bg-[#F48B29] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#F48B29] pixel-shadow-sm"
            }`}
          >
            <Target className="w-4 h-4" />
            {t("创始人/HR", "Founder / HR")}
          </button>
        </div>
      </section>

      {/* Projects Bento Box */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className={`group block border-2 border-black p-6 bg-white transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 font-sans flex flex-col justify-between ${
              project.size === "large" ? "md:col-span-2 lg:col-span-2" : "col-span-1"
            } ${project.theme.shadow}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-sm border-2 border-black pixel-shadow-sm ${project.theme.bg} ${project.theme.text}`}>
                  <Rocket className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4">{bt(project.title)}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{bt(project.description)}</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.categories.map((cat) => (
                  <span key={cat} className="text-[10px] font-mono font-bold uppercase px-2 py-1 bg-gray-100 border border-gray-300 rounded-sm">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-gray-100">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="flex items-center text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-[#4DA65C]" />
                    {bt(metric)}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

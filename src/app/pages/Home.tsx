import { useState } from "react";
import { Link } from "react-router";
import { Code, Brain, Target, Rocket, ArrowUpRight, CheckCircle2 } from "lucide-react";
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
      zh: "AI广告视频混剪智能体系统",
      en: "AI Ad Video Agent System",
    },
    description: {
      zh: "独立设计面向Agent的执行运行时，结合上下文工程策略与工具链服务化，实现广告视频智能混剪全流程自动化。",
      en: "Independently designed an Agent-oriented execution runtime with context engineering and tool-chain services, automating the full pipeline of AI-driven ad video remixing.",
    },
    categories: ["algorithm", "engineering"],
    metrics: [
      { zh: "累计投放37条广告", en: "37 Ads Deployed" },
      { zh: "获客成本约30元", en: "~¥30 CAC" },
    ],
    theme: { bg: "bg-[#E43B44]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#E43B44]" },
    size: "large",
  },
  {
    id: "rag-engine",
    title: {
      zh: "AI内容运营全链路智能体系统",
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
      zh: "AI短剧平台SkyReels",
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
      zh: "社会模拟多智能体系统",
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
      {/* Hero Section */}
      <section className="bg-white border-2 border-black pixel-shadow p-8 sm:p-12 mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA65C] opacity-10 rounded-bl-full" />
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#E43B44] text-white px-3 py-1 font-bold text-sm uppercase tracking-wider border-2 border-black">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>{t("正在求职中", "Available for Hire")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 font-sans">
            {t("AI时代超级个体。", "AI-Era Super Individual.")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D79E4] to-[#4DA65C]">
              {t("算法 × 工程 × 产品", "Algorithms × Engineering × Product")}
            </span>
          </h1>

          <p className="text-lg text-gray-600 font-sans max-w-2xl leading-relaxed">
            {t(
              "我不仅训练模型，更架构可落地的生产级系统、设计直觉化的用户体验，并交付真实的业务价值。从大模型科研到出海产品上线，再到生产级系统工程落地，具备完整AI实践路径。",
              "I don't just train models. I architect scalable production systems, design intuitive user experiences, and deliver real business impact. From LLM research to overseas product launch to production-grade engineering — a complete AI practitioner's path."
            )}
          </p>
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

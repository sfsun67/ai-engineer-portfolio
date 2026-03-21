import { useState } from "react";
import { Link } from "react-router";
import { Code, Brain, Target, Rocket, ArrowUpRight, CheckCircle2 } from "lucide-react";

type Category = "all" | "algorithm" | "engineering" | "product" | "founder";

interface Project {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  metrics: string[];
  theme: { bg: string; text: string; shadow: string };
  size: "large" | "medium" | "small";
}

const projects: Project[] = [
  {
    id: "agent-system",
    title: "Autonomous Agent System",
    description: "A multi-agent framework leveraging LLMs for autonomous task planning and execution. Incorporates complex reasoning and self-reflection.",
    categories: ["algorithm", "engineering"],
    metrics: ["95% Task Success", "40% Latency Drop"],
    theme: { bg: "bg-[#E43B44]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#E43B44]" },
    size: "large",
  },
  {
    id: "rag-engine",
    title: "Enterprise RAG Pipeline",
    description: "High-performance retrieval-augmented generation system parsing millions of complex enterprise documents.",
    categories: ["engineering", "product"],
    metrics: ["1B+ Docs indexed", "<50ms P99"],
    theme: { bg: "bg-[#1D79E4]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#1D79E4]" },
    size: "medium",
  },
  {
    id: "ai-bi",
    title: "Conversational BI Analyst",
    description: "End-to-end AI product translating natural language into SQL, charts, and actionable business insights.",
    categories: ["product", "founder"],
    metrics: ["200+ Enterprise clients", "$5M ARR Impact"],
    theme: { bg: "bg-[#F4D330]", text: "text-gray-900", shadow: "hover:shadow-[6px_6px_0px_#F4D330]" },
    size: "medium",
  },
  {
    id: "eval-framework",
    title: "LLM Eval Framework",
    description: "Rigorous testing suite for hallucination detection and model robustness benchmarking.",
    categories: ["algorithm", "founder"],
    metrics: ["Open Source", "1.2k GitHub Stars"],
    theme: { bg: "bg-[#F48B29]", text: "text-white", shadow: "hover:shadow-[6px_6px_0px_#F48B29]" },
    size: "small",
  }
];

export function Home() {
  const [activeTab, setActiveTab] = useState<Category>("all");

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
            <span>Available for Hire</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 font-sans">
            AI-Era Super Individual. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D79E4] to-[#4DA65C]">
              Algorithms &times; Engineering &times; Product
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 font-sans max-w-2xl leading-relaxed">
            I don't just train models. I architect scalable systems, design intuitive user experiences, and deliver real business impact. Ready to accelerate your AI initiatives from paper to production.
          </p>
        </div>
      </section>

      {/* King Kong Area (Filters) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-sans flex items-center">
          <Target className="w-6 h-6 mr-2 text-[#E43B44]" />
          Choose Your Perspective
        </h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black ${
              activeTab === "all" ? "bg-black text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 pixel-shadow-sm"
            }`}
          >
            All Works
          </button>
          
          <button
            onClick={() => setActiveTab("algorithm")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "algorithm" ? "bg-[#1D79E4] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#1D79E4] pixel-shadow-sm"
            }`}
          >
            <Brain className="w-4 h-4" />
            Algorithm Lead
          </button>

          <button
            onClick={() => setActiveTab("engineering")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "engineering" ? "bg-[#4DA65C] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#4DA65C] pixel-shadow-sm"
            }`}
          >
            <Code className="w-4 h-4" />
            Engineering Lead
          </button>

          <button
            onClick={() => setActiveTab("product")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "product" ? "bg-[#F4D330] text-black pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#F4D330] pixel-shadow-sm"
            }`}
          >
            <Rocket className="w-4 h-4" />
            Product / Biz Lead
          </button>

          <button
            onClick={() => setActiveTab("founder")}
            className={`px-5 py-2.5 font-bold uppercase tracking-wider text-sm transition-all border-2 border-black flex items-center gap-2 ${
              activeTab === "founder" ? "bg-[#F48B29] text-white pixel-shadow-sm" : "bg-white text-gray-600 hover:text-[#F48B29] pixel-shadow-sm"
            }`}
          >
            <Target className="w-4 h-4" />
            Founder / HR
          </button>
        </div>
      </section>

      {/* Projects Bento Box */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense">
        {filteredProjects.map((project, index) => (
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
              
              <h3 className="text-2xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4">{project.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{project.description}</p>
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
                    {metric}
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

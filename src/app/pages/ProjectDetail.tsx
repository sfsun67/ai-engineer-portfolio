import { useParams, Link } from "react-router";
import { PlayCircle, ArrowLeft, ArrowUpRight } from "lucide-react";

const projectData: Record<string, any> = {
  "agent-system": {
    title: "Autonomous Agent System",
    emoji: "🤖",
    description: "A multi-agent framework leveraging LLMs for autonomous task planning and execution.",
    tldr: "Built an enterprise-grade multi-agent architecture capable of complex reasoning, planning, and tool use, cutting manual processing time by 80%.",
    whyItMatters: "Most agents fail in complex environments due to brittle logic. This system employs reflective reasoning loops and dynamic tool discovery, enabling true autonomous task resolution in unconstrained enterprise environments.",
    systemDesign: "The architecture splits planning, execution, and reflection into microservices. The Planner uses Chain-of-Thought (CoT) combined with Tree-of-Thoughts (ToT) for complex branching. State is managed via Redis and a persistent vector DB (Milvus).",
    techChallenges: [
      "Preventing context window bloat during long-running tasks.",
      "Ensuring deterministic outputs from non-deterministic LLMs during tool invocation.",
      "Achieving < 1.5s latency per agent hop."
    ],
    outcomes: "Deployed to 5 internal teams, automating 12,000+ support tickets/month with a 95% resolution success rate.",
    reflection: "Focusing on agent evaluation early saved us months of debugging. If I were to rebuild it, I'd implement a more robust DSPy-style prompt optimization pipeline from day one."
  },
  "rag-engine": {
    title: "Enterprise RAG Pipeline",
    emoji: "📚",
    description: "High-performance retrieval-augmented generation system parsing millions of complex enterprise documents.",
    tldr: "Engineered a high-throughput RAG pipeline combining sparse and dense retrieval, reducing hallucination by 92% across a corpus of 10M+ documents.",
    whyItMatters: "Standard semantic search fails on highly technical or domain-specific terminology. Hybrid search with contextual re-ranking is non-negotiable for enterprise accuracy.",
    systemDesign: "Ingestion pipeline built with Apache Airflow. Documents are chunked semantically. Retrieval uses a hybrid approach (BM25 + BGE-M3) followed by a Cross-Encoder for reranking. LLM generation leverages vLLM for high-throughput serving.",
    techChallenges: [
      "Parsing complex PDFs with multi-column layouts and tables.",
      "Balancing latency (<500ms) with the compute cost of Cross-Encoders.",
      "Handling out-of-domain queries gracefully."
    ],
    outcomes: "Achieved P99 latency of 450ms, 92% reduction in hallucination, and integrated across 3 flagship products.",
    reflection: "Data quality trumps model size. We spent 70% of our time optimizing the chunking strategy and metadata extraction, which yielded higher ROI than finetuning the LLM."
  }
};

export function ProjectDetail() {
  const { id } = useParams();
  
  // Fallback to the first project if not found
  const project = projectData[id || "agent-system"] || projectData["agent-system"];

  return (
    <div className="max-w-4xl mx-auto py-8 font-sans pb-32">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to projects
      </Link>
      
      {/* Notion-style Paper Container */}
      <article className="bg-white border-2 border-black pixel-shadow p-8 sm:p-14 text-gray-800 notion-container relative">
        <div className="text-6xl mb-6">{project.emoji}</div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
          {project.title}
        </h1>
        
        <p className="text-xl text-gray-500 font-medium mb-12">
          {project.description}
        </p>
        
        {/* CTA Banner */}
        <div className="bg-[#E43B44]/10 border-2 border-[#E43B44] p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F4D330] border-2 border-black rounded-full animate-bounce"></div>
          <div>
            <h3 className="text-lg font-bold text-[#E43B44] mb-1">Ready to see it in action?</h3>
            <p className="text-sm text-gray-700">Experience the live demonstration environment with interactive data.</p>
          </div>
          <Link
            to={`/demo/${id}`}
            className="group inline-flex items-center whitespace-nowrap px-6 py-3 bg-[#E43B44] text-white font-bold uppercase tracking-wider text-sm border-2 border-black pixel-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            👉 Experience Demo
            <PlayCircle className="w-4 h-4 ml-2 group-hover:animate-pulse" />
          </Link>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#1D79E4]">TL;DR</h2>
            <p className="text-lg leading-relaxed text-gray-700">{project.tldr}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#F48B29]">Why this matters</h2>
            <p className="text-lg leading-relaxed text-gray-700">{project.whyItMatters}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#4DA65C]">System Design</h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 mb-4 flex items-center justify-center h-48 rounded-sm text-gray-400 font-mono text-sm">
              [Architecture Diagram Placeholder]
            </div>
            <p className="text-lg leading-relaxed text-gray-700">{project.systemDesign}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#E43B44]">Technical Challenges</h2>
            <ul className="space-y-3 list-none">
              {project.techChallenges.map((challenge: string, i: number) => (
                <li key={i} className="flex items-start text-lg leading-relaxed text-gray-700">
                  <span className="inline-block w-2 h-2 mt-2.5 mr-3 bg-black rounded-sm shrink-0"></span>
                  {challenge}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#F4D330]">Outcomes</h2>
            <p className="text-lg leading-relaxed text-gray-700">{project.outcomes}</p>
          </section>

          <section className="bg-gray-900 text-gray-300 p-8 rounded-sm border-2 border-black pixel-shadow font-mono text-sm">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-[#4DA65C] mr-2">{">"}</span>
              Reflection & Takeaways
            </h2>
            <p className="leading-relaxed">
              {project.reflection}
            </p>
          </section>
        </div>
      </article>
      
      <div className="mt-12 text-center">
        <Link
          to={`/demo/${id}`}
          className="inline-flex items-center text-lg font-bold text-gray-800 hover:text-[#1D79E4] transition-colors underline decoration-2 underline-offset-4"
        >
          Proceed to interactive demo <ArrowUpRight className="w-5 h-5 ml-1" />
        </Link>
      </div>
    </div>
  );
}

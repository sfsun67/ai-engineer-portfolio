export type Project = {
  id: string;
  title: string;
  description: string;
  roles: string[]; // which role this appeals to
  tags: string[]; // specific technical/biz tags
  imageQuery: string;
  metrics: string[];
  systemDesign?: string;
  challenges?: string;
  outcomes?: string;
  reflection?: string;
};

export const projectsData: Project[] = [
  {
    id: "agent-system",
    title: "Autonomous Agent System",
    description: "An intelligent autonomous agent framework capable of solving complex multi-step reasoning tasks with tool use.",
    roles: ["算法负责人", "创始人/招聘经理"],
    tags: ["Agent", "RAG", "System Design"],
    imageQuery: "abstract artificial intelligence network",
    metrics: ["94% Success Rate", "10x Productivity", "State-of-the-art"],
    systemDesign: "The system is built on a ReAct architecture with a customized memory retrieval pipeline. It uses a dynamic tool-calling router that selects from over 50 custom APIs to fulfill user intents. The state machine is robustly handled using langgraph-inspired flows.",
    challenges: "Handling context window limits when dealing with extensive tool documentation. Implemented a hierarchical summarize-and-retrieve mechanism to inject only relevant API schemas into the prompt.",
    outcomes: "Reduced manual operation time by 80% for internal teams. Achieved a task completion rate of 94% on our internal benchmark, outperforming open-source baselines by 20%.",
    reflection: "Building agents requires a deep understanding of both LLM capabilities and traditional software engineering. Next steps involve moving from zero-shot tool use to few-shot dynamically retrieved examples."
  },
  {
    id: "rag-pipeline",
    title: "Enterprise-Grade RAG Pipeline",
    description: "High-performance Retrieval-Augmented Generation system with semantic routing and hybrid search.",
    roles: ["算法负责人", "工程负责人"],
    tags: ["RAG", "Performance", "Architecture"],
    imageQuery: "server rack database glowing",
    metrics: ["Sub-200ms Latency", "99.9% Uptime", "Hybrid Search"],
    systemDesign: "Implemented a two-stage retrieval pipeline: Dense vector retrieval (using specialized embedding models) combined with BM25 sparse retrieval. Re-ranking is performed via a cross-encoder before final LLM synthesis.",
    challenges: "The main challenge was latency. Vector similarity search over 50M+ documents was too slow. We optimized the HNSW index parameters and implemented a caching layer for common queries.",
    outcomes: "System handles 10,000 QPS with p95 latency under 200ms. Improved answer accuracy by 35% compared to baseline dense retrieval.",
    reflection: "Caching is king in production RAG. The hybrid approach is essential for handling keyword-heavy queries where semantic models often fail."
  },
  {
    id: "model-eval-framework",
    title: "LLM Eval Framework",
    description: "Comprehensive evaluation platform for testing large language models against business-specific domains.",
    roles: ["算法负责人", "产品/业务负责人"],
    tags: ["评测", "业务结果", "产能提升"],
    imageQuery: "dashboard analytics charts modern",
    metrics: ["50+ Benchmarks", "Automated CI/CD", "Biz Aligned"],
    systemDesign: "A distributed testing framework that automatically triggers evals when new models are deployed. Uses a combination of LLM-as-a-judge and deterministic metrics (ROUGE, exact match).",
    challenges: "Ensuring LLM-as-a-judge consistency. Solved by carefully designing rubrics and using a consensus mechanism with multiple smaller models.",
    outcomes: "Shortened the model release cycle from weeks to days. Provided product managers with clear, actionable insights on model performance.",
    reflection: "Evaluation is the true bottleneck of AI engineering. A robust eval framework is more valuable than marginally better models."
  },
  {
    id: "inference-engine",
    title: "High-Throughput Inference Service",
    description: "Highly optimized model serving infrastructure supporting dynamic batching and paged attention.",
    roles: ["工程负责人", "创始人/招聘经理"],
    tags: ["性能", "服务化", "稀缺性"],
    imageQuery: "futuristic microchip glowing blue",
    metrics: ["5x Throughput", "Zero Downtime", "Cost Reduced 60%"],
    systemDesign: "Built on top of vLLM with custom scheduling algorithms. The API gateway handles load balancing, dynamic batching, and graceful degradation during traffic spikes.",
    challenges: "Managing GPU memory fragmentation. Integrated PagedAttention to eliminate memory waste, allowing for significantly larger batch sizes.",
    outcomes: "Increased inference throughput by 5x while reducing compute costs by 60%. Deployed across multiple regions with active-active failover.",
    reflection: "Understanding hardware limits is just as important as the model architecture. Engineering excellence directly impacts the bottom line."
  }
];
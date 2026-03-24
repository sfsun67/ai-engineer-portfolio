export type Project = {
  id: string;
  title: string;
  description: string;
  roles: string[];
  tags: string[];
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
    title: "AI广告视频混剪智能体系统（建设中...）",
    description: "独立设计面向Agent的执行运行时，结合上下文工程策略与工具链服务化，实现广告视频智能混剪全流程自动化。",
    roles: ["算法负责人", "工程负责人"],
    tags: ["Agent Runtime", "MCP", "vLLM", "Milvus", "Context Engineering"],
    imageQuery: "abstract artificial intelligence network",
    metrics: ["新增用户约万人", "获客成本约30元"],
    systemDesign: "架构核心是自研的Agent执行运行时，将脚本规划、音频生成、多模态理解、媒体处理等能力拆分为决策节点与MCP Tool执行节点。上下文工程策略统一上下文表示与状态承载格式。工具链通过MCP协议服务化。",
    challenges: "长链路任务中上下文窗口膨胀的管理策略设计。Agent Runtime的容错与重试机制。多模态素材的统一处理与编排。",
    outcomes: "新增用户约万人，平均获客成本约30元。",
    reflection: "Agent系统的核心不在于模型能力，而在于Runtime的工程可靠性。Agent Harness 策略的设计比Prompt Engineering更重要。"
  },
  {
    id: "rag-engine",
    title: "AI内容运营全链路智能体系统（建设中...）",
    description: "基于Multi-Agent与多模态混合检索架构，实现广告文图素材自动化处理与社交媒体内容分发。",
    roles: ["工程负责人", "产品/业务负责人"],
    tags: ["Multi-Agent", "RAG", "VLM", "Hybrid Retrieval"],
    imageQuery: "content management dashboard modern",
    metrics: ["处理近万张素材", "日均400+条", "自动化发布"],
    systemDesign: "基于"感知—规划—记忆—行动"机制的Multi-Agent协作架构。多模态混合检索引擎支持BM25关键词、文本向量语义、图向量语义三路召回。",
    challenges: "多源异构广告素材的统一表示与检索。日均400+条素材的高吞吐量处理与质量保障。",
    outcomes: "处理近万张多源广告文图素材，自动化发表社交媒体内容数百篇，日均处理素材400余条。",
    reflection: "多模态检索的关键在于表示空间的对齐，而非单纯提升单模态检索精度。"
  },
  {
    id: "ai-bi",
    title: "AI短剧平台SkyReels（建设中...）",
    description: "昆仑万维出海AI短剧产品，负责多智能体系统设计、RAG系统构建及多模态训练数据建设。",
    roles: ["产品/业务负责人", "算法负责人"],
    tags: ["Multi-Agent", "RAG", "Data Flywheel", "SkyReels"],
    imageQuery: "film production creative ai",
    metrics: ["Agent系统60%代码", "上线北美地区", "决赛8/639"],
    systemDesign: "基于Workflow/ReAct范式的多智能体框架。RAG检索增强链路与Function Calling槽位抽取方案。数据飞轮机制构建训练链路。",
    challenges: "多智能体间的协作一致性与任务调度。RAG系统在创意生成场景下的检索策略设计。",
    outcomes: "负责Agent系统链路60%的代码生产与发布。AI短剧平台成功上线北美地区。优酷×天池挑战赛决赛第8名。",
    reflection: "出海产品的技术挑战不仅在算法本身，更在于对目标市场内容偏好的理解与适配。"
  },
  {
    id: "agency-personalities-trails",
    title: "Agency: 文学角色性格特征数据集与评测工具链",
    description: "面向人工智能体研究的双语文学分析数据集，配套特征提取流水线、RAG角色扮演API与评测基准（RPBench / SocialBench）。",
    roles: ["算法负责人", "创始人/招聘经理"],
    tags: ["RAG", "Literary Analysis", "Role-Play", "ChromaDB", "FastAPI"],
    imageQuery: "literature book ai analysis",
    metrics: ["5w+文学分析记录", "RAG性能↑76%", "社会能力92.9%"],
    systemDesign: "从EPUB文学文本中提取角色画像、心理特征与行为线索，构建412个JSON文件（~5.3GB）的双语结构化数据集。基于FastAPI + ChromaDB + Gemini Embeddings构建RAG角色扮演API，支持SSE流式对话。通过RPBench和SocialBench两套评测基准验证RAG增强效果。",
    challenges: "跨语言文学分析的结构化提取与质量控制。RAG检索策略对不同规模模型的差异化影响。角色扮演与社会性评测基准的设计与可复现性。",
    outcomes: "构建5万+文学分析记录的双语数据集。RPBench评测中qwen2.5-32b加RAG后胜率76.1%（无RAG仅23.7%）。SocialBench自我意识准确率92.9%，社会偏好准确率80.3%。",
    reflection: "RAG对强模型有显著提升但对弱模型无效甚至有害，这揭示了检索增强与模型能力之间的协同门槛。数据质量远比数据数量重要。"
  }
];

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
    reflection: "Agent系统的核心不在于模型能力，而在于Runtime的工程可靠性。上下文工程策略的设计比Prompt Engineering更重要。"
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
    id: "eval-framework",
    title: "社会模拟多智能体系统（建设中...）",
    description: "基于认知心理学的角色扮演与社会模拟系统，构建大规模场景数据用于模型对齐与推理增强。",
    roles: ["算法负责人", "创始人/招聘经理"],
    tags: ["Cognitive Psychology", "Multi-Agent", "Model Alignment", "ReAct"],
    imageQuery: "brain neural network psychology",
    metrics: ["1.8w+场景数据", "7B+模型性能↑90%", "社会能力75%→90%"],
    systemDesign: "基于认知科学、心理学与语言学理论构建角色扮演/社会模拟结构化训练数据。角色—情景CoT数据链与RAG增强链路。ReAct多智能体协同框架。",
    challenges: "认知心理学理论到计算模型的形式化转换。确保生成场景数据的多样性与真实性。",
    outcomes: "构建1.8w+场景数据。7B+模型角色扮演性能提升90%以上，社会能力评测从75%提升至90%。",
    reflection: "数据质量远比数据数量重要。认知心理学为AI对齐提供了有价值的理论框架。"
  }
];

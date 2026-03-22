import { useParams, Link } from "react-router";
import { PlayCircle, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface BiText {
  zh: string;
  en: string;
}

interface ProjectData {
  title: BiText;
  emoji: string;
  description: BiText;
  tldr: BiText;
  whyItMatters: BiText;
  systemDesign: BiText;
  techChallenges: BiText[];
  outcomes: BiText;
  reflection: BiText;
}

const projectData: Record<string, ProjectData> = {
  "agent-system": {
    title: {
      zh: "AI广告视频混剪智能体系统",
      en: "AI Ad Video Agent System",
    },
    emoji: "🎬",
    description: {
      zh: "三七互娱 | MCP / Agent Runtime / vLLM / Milvus / Redis",
      en: "37 Interactive | MCP / Agent Runtime / vLLM / Milvus / Redis",
    },
    tldr: {
      zh: "独立设计面向Agent的执行运行时，结合上下文工程与工具链服务化，实现广告视频混剪全流程自动化，累计投放37条广告，新增用户约万人。",
      en: "Independently designed an Agent-oriented execution runtime with context engineering and tool-chain services, fully automating the ad video remixing pipeline. Deployed 37 ads, acquiring ~10K new users.",
    },
    whyItMatters: {
      zh: "传统广告素材制作依赖人工，效率低且难以规模化。通过Agent Runtime的自主规划与执行能力，将视频混剪从人工操作转为智能化流水线，大幅降低获客成本至约30元/人。",
      en: "Traditional ad creative production relies on manual effort — slow and hard to scale. The Agent Runtime's autonomous planning and execution capability transforms video remixing into an intelligent pipeline, reducing customer acquisition cost to ~¥30/user.",
    },
    systemDesign: {
      zh: "架构核心是自研的Agent执行运行时，将脚本规划、音频生成、多模态理解、媒体处理等能力拆分为决策节点与MCP Tool执行节点。上下文工程策略设计统一的上下文表示与状态承载格式，将多源结果结构化为持久化中间态记忆，驱动LLM在创意生成、素材筛选、质量判断与迭代优化中的上下文感知决策。工具链通过MCP协议服务化，支持鉴权、超时控制、重试、异步回调与结果回传。",
      en: "The core is a custom Agent execution runtime that splits script planning, audio generation, multimodal understanding, and media processing into decision nodes and MCP Tool execution nodes. The context engineering strategy unifies context representation and state formats, structuring multi-source results as persistent intermediate memory to drive LLM context-aware decisions across creative generation, asset selection, quality judgment, and iterative optimization. Tool chains are served via MCP protocol with auth, timeout control, retry, async callbacks, and result passback.",
    },
    techChallenges: [
      {
        zh: "长链路任务中上下文窗口膨胀的管理策略设计。",
        en: "Managing context window bloat during long-running multi-step tasks.",
      },
      {
        zh: "Agent Runtime的容错与重试机制，确保生产环境稳定性。",
        en: "Fault tolerance and retry mechanisms in the Agent Runtime for production stability.",
      },
      {
        zh: "多模态素材（视频、图片、文案）的统一处理与编排。",
        en: "Unified processing and orchestration of multimodal assets (video, images, copy).",
      },
    ],
    outcomes: {
      zh: "累计投放37条广告，新增用户约万人，平均获客成本约30元。素材平均点击率与转化率均优于人工制作基线，设计人员素材生产人效预计可提升约数倍。获得事业群集训优秀奖、集团AI大赛潜力奖。",
      en: "Deployed 37 ads, acquiring ~10K new users at ~¥30 CAC. Average CTR and conversion rate outperformed manual production baselines. Estimated designer productivity improvement of several times. Won Business Group Training Excellence Award and Group AI Competition Potential Award.",
    },
    reflection: {
      zh: "Agent系统的核心不在于模型能力，而在于Runtime的工程可靠性。上下文工程策略的设计比Prompt Engineering更重要，它决定了Agent在长任务中的稳定性与决策质量。",
      en: "The core of an Agent system isn't model capability — it's Runtime engineering reliability. Context engineering strategy design matters more than prompt engineering; it determines Agent stability and decision quality in long-running tasks.",
    },
  },
  "rag-engine": {
    title: {
      zh: "AI内容运营全链路智能体系统",
      en: "AI Content Ops Agent System",
    },
    emoji: "📱",
    description: {
      zh: "三七互娱 | Multi-Agent / RAG / VLM",
      en: "37 Interactive | Multi-Agent / RAG / VLM",
    },
    tldr: {
      zh: "负责项目整体方案推进，设计多模态混合检索架构，实现近万张广告素材自动化处理与社交媒体内容自动发布，日均处理素材400余条。",
      en: "Led overall project architecture, designed multimodal hybrid retrieval system, automating processing of ~10K ad assets and social media content publishing at 400+/day throughput.",
    },
    whyItMatters: {
      zh: "内容运营的规模化需要突破人工处理瓶颈。多模态混合检索架构使系统能同时理解图片和文本素材，围绕「爬取→分析→生成→审核→发布」内容运营流程实现全链路自动化。",
      en: "Scaling content operations requires breaking through manual processing bottlenecks. The multimodal hybrid retrieval architecture enables simultaneous understanding of image and text assets, automating the full \"crawl → analyze → generate → review → publish\" content pipeline.",
    },
    systemDesign: {
      zh: "基于「感知—规划—记忆—行动」机制的Multi-Agent协作架构。多模态混合检索引擎支持BM25关键词、文本向量语义、图向量语义三路召回，完成爬虫数据、业务文档、图像素材库等多源数据接入、清洗与统一索引构建，为Agent提供可检索的外部知识与历史经验记忆。",
      en: "Multi-Agent collaboration architecture based on \"perceive — plan — remember — act\" paradigm. The multimodal hybrid retrieval engine supports three-way recall: BM25 keyword, text vector semantic, and image vector semantic. It ingests, cleans, and indexes multi-source data from crawlers, business documents, and image asset libraries, providing Agents with searchable external knowledge and historical experience memory.",
    },
    techChallenges: [
      {
        zh: "多源异构广告素材（图片、文案、视频截图）的统一表示与检索。",
        en: "Unified representation and retrieval of heterogeneous ad assets (images, copy, video screenshots).",
      },
      {
        zh: "日均400+条素材的高吞吐量处理与质量保障。",
        en: "High-throughput processing (400+/day) while maintaining quality assurance.",
      },
      {
        zh: "社交媒体平台内容规范适配与自动化发布链路的稳定性。",
        en: "Adapting to social media platform content guidelines and ensuring stable automated publishing.",
      },
    ],
    outcomes: {
      zh: "处理近万张多源广告文图素材，自动化发表社交媒体内容数百篇，日均处理素材400余条。",
      en: "Processed ~10K multi-source ad text-image assets, automated hundreds of social media posts, 400+ assets/day throughput.",
    },
    reflection: {
      zh: "多模态检索的关键在于表示空间的对齐，而非单纯提升单模态检索精度。端到端的自动化链路需要在每个环节预留人工审核接口，确保质量可控。",
      en: "The key to multimodal retrieval is aligning representation spaces, not just improving single-modality precision. End-to-end automation pipelines need human review interfaces at each stage to ensure quality control.",
    },
  },
  "ai-bi": {
    title: {
      zh: "AI短剧平台SkyReels",
      en: "AI Short Drama Platform SkyReels",
    },
    emoji: "🎬",
    description: {
      zh: "昆仑万维 Skywork AI | Multi-Agent / RAG / 数据飞轮",
      en: "Kunlun Skywork AI | Multi-Agent / RAG / Data Flywheel",
    },
    tldr: {
      zh: "参与AI短剧平台SkyReels的Agent系统设计与开发，负责60%核心代码，推动产品上线北美地区。同时参与小说生成大模型训练与多模态训练数据建设。",
      en: "Contributed to SkyReels AI short drama platform's Agent system design and development, responsible for 60% of core code, driving product launch in North America. Also participated in novel generation LLM training and multimodal training data pipelines.",
    },
    whyItMatters: {
      zh: "AI驱动的短剧创作代表内容生成的新范式。通过多智能体协作实现从创意生成到角色设计、分镜推理、生图/视频等环节的全流程自动化，大幅降低内容生产成本。",
      en: "AI-driven short drama creation represents a new paradigm in content generation. Multi-agent collaboration automates the full pipeline from creative ideation to character design, storyboard reasoning, and image/video generation, dramatically reducing content production costs.",
    },
    systemDesign: {
      zh: "基于Workflow/ReAct范式的多智能体框架，将创意生成、人物设定、分镜推理、生图/视频等环节拆解为Agent节点。RAG检索增强链路与Function Calling槽位抽取方案提升创意生成、人物信息补全与分镜序列推理的稳定性和内容质量。数据飞轮机制围绕业务数据、RAG数据、结构化输出数据与多模态理解数据构建训练链路。",
      en: "Multi-agent framework based on Workflow/ReAct paradigm, decomposing creative generation, character design, storyboard reasoning, and image/video production into Agent nodes. RAG retrieval-augmented pipeline with Function Calling slot extraction improves stability and quality of creative generation, character information completion, and storyboard sequence reasoning. Data flywheel mechanism builds training pipelines around business data, RAG data, structured output data, and multimodal understanding data.",
    },
    techChallenges: [
      {
        zh: "多智能体间的协作一致性与任务调度。",
        en: "Consistency in multi-agent collaboration and task scheduling.",
      },
      {
        zh: "RAG系统在创意生成场景下的检索策略设计。",
        en: "Retrieval strategy design for RAG systems in creative generation scenarios.",
      },
      {
        zh: "多模态训练数据的质量控制与标注规范建立。",
        en: "Quality control and annotation standards for multimodal training data.",
      },
    ],
    outcomes: {
      zh: "负责Agent系统链路60%的代码生产与发布，处理多模态训练语料数万条。AI短剧平台成功上线北美地区。另外参与小说生成大模型项目，在优酷×天池「酷文」小说创作大模型挑战赛中获决赛第8名（639队）。",
      en: "Responsible for 60% of Agent system code production and deployment. Processed tens of thousands of multimodal training data entries. AI short drama platform successfully launched in North America. Also participated in a novel generation LLM project, reaching the finals (8th/639 teams) in the Youku × Tianchi novel creation challenge.",
    },
    reflection: {
      zh: "出海产品的技术挑战不仅在算法本身，更在于对目标市场内容偏好的理解与适配。数据飞轮的建设是产品持续迭代的核心驱动力。",
      en: "The technical challenge of overseas products isn't just the algorithm itself — it's understanding and adapting to target market content preferences. Building a data flywheel is the core driver for continuous product iteration.",
    },
  },
  "eval-framework": {
    title: {
      zh: "社会模拟多智能体系统",
      en: "Social Simulation Multi-Agent System",
    },
    emoji: "🧠",
    description: {
      zh: "中国电信人工智能研究院 | 认知心理学 / Multi-Agent / 模型对齐",
      en: "China Telecom AI Research | Cognitive Psychology / Multi-Agent / Model Alignment",
    },
    tldr: {
      zh: "基于认知心理学框架构建社会模拟多智能体系统，生成1.8w+场景数据，将7B+模型角色扮演性能提升90%以上，社会能力评测从75%提升至90%。",
      en: "Built a social simulation multi-agent system based on cognitive psychology frameworks, generating 18K+ scenario data, improving 7B+ model role-playing performance by 90%+, and social capability scores from 75% to 90%.",
    },
    whyItMatters: {
      zh: "模型对齐与推理能力的提升需要高质量、多样化的训练数据。基于认知心理学的社会模拟框架能生成具有真实社会交互特征的场景数据，显著提升模型的角色扮演与社会推理能力。",
      en: "Improving model alignment and reasoning requires high-quality, diverse training data. The cognitive psychology-based social simulation framework generates scenario data with realistic social interaction characteristics, significantly enhancing role-playing and social reasoning capabilities.",
    },
    systemDesign: {
      zh: "基于认知科学、心理学与语言学理论，从文学文本中抽取情景、角色画像、心理特征与行为线索，构建面向角色扮演/社会模拟任务的结构化训练数据。设计角色—情景CoT数据链与RAG增强链路，基于ReAct构建多智能体协同框架，增强模型在社会模拟、情感交互与创意生成任务中的表现。",
      en: "Based on cognitive science, psychology, and linguistics theory, extracting scenarios, character profiles, psychological traits, and behavioral cues from literary texts to construct structured training data for role-playing/social simulation tasks. Designed role-scenario CoT data chains and RAG-enhanced pipelines, built multi-agent collaboration framework based on ReAct, enhancing model performance in social simulation, emotional interaction, and creative generation tasks.",
    },
    techChallenges: [
      {
        zh: "认知心理学理论到计算模型的形式化转换。",
        en: "Formalizing cognitive psychology theories into computational models.",
      },
      {
        zh: "确保生成场景数据的多样性与真实性。",
        en: "Ensuring diversity and authenticity of generated scenario data.",
      },
      {
        zh: "小模型（7B级别）在有限数据下的训练效率优化。",
        en: "Training efficiency optimization for small models (7B-class) with limited data.",
      },
    ],
    outcomes: {
      zh: "构建1.8w+场景数据。角色扮演评测中7B+模型性能提升90%以上，社会能力评测从75%提升至90%。另外参与小说生成大模型项目，在优酷×天池「酷文」挑战赛获决赛第8名（639队）。",
      en: "Generated 18K+ scenario data. 7B+ model performance improved by 90%+ in role-playing evaluation, social capability scores rose from 75% to 90%. Also participated in novel generation LLM project, reaching finals (8th/639 teams) in Youku × Tianchi challenge.",
    },
    reflection: {
      zh: "数据质量远比数据数量重要。认知心理学为AI对齐提供了有价值的理论框架，但理论到工程实现的gap需要大量实验来弥合。",
      en: "Data quality matters far more than data quantity. Cognitive psychology provides a valuable theoretical framework for AI alignment, but bridging the gap from theory to engineering requires extensive experimentation.",
    },
  },
};

export function ProjectDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();

  const project = projectData[id || "agent-system"] || projectData["agent-system"];
  const bt = (bi: BiText) => (lang === "zh" ? bi.zh : bi.en);

  return (
    <div className="max-w-4xl mx-auto py-8 font-sans pb-32">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("返回项目列表", "Back to projects")}
      </Link>

      {/* Notion-style Paper Container */}
      <article className="bg-white border-2 border-black pixel-shadow p-8 sm:p-14 text-gray-800 notion-container relative">
        <div className="text-6xl mb-6">{project.emoji}</div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
          {bt(project.title)}
        </h1>

        <p className="text-xl text-gray-500 font-medium mb-12">
          {bt(project.description)}
        </p>

        {/* CTA Banner */}
        <div className="bg-[#E43B44]/10 border-2 border-[#E43B44] p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F4D330] border-2 border-black rounded-full animate-bounce"></div>
          <div>
            <h3 className="text-lg font-bold text-[#E43B44] mb-1">{t("想看看实际效果？", "Ready to see it in action?")}</h3>
            <p className="text-sm text-gray-700">{t("体验包含真实数据的交互式演示环境。", "Experience the live demonstration environment with interactive data.")}</p>
          </div>
          <Link
            to={`/demo/${id}`}
            className="group inline-flex items-center whitespace-nowrap px-6 py-3 bg-[#E43B44] text-white font-bold uppercase tracking-wider text-sm border-2 border-black pixel-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            {t("👉 体验演示", "👉 Experience Demo")}
            <PlayCircle className="w-4 h-4 ml-2 group-hover:animate-pulse" />
          </Link>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#1D79E4]">{t("核心摘要", "TL;DR")}</h2>
            <p className="text-lg leading-relaxed text-gray-700">{bt(project.tldr)}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#F48B29]">{t("项目价值", "Why this matters")}</h2>
            <p className="text-lg leading-relaxed text-gray-700">{bt(project.whyItMatters)}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#4DA65C]">{t("系统设计", "System Design")}</h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 mb-4 flex items-center justify-center h-48 rounded-sm text-gray-400 font-mono text-sm">
              {t("[架构图占位]", "[Architecture Diagram Placeholder]")}
            </div>
            <p className="text-lg leading-relaxed text-gray-700">{bt(project.systemDesign)}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#E43B44]">{t("技术挑战", "Technical Challenges")}</h2>
            <ul className="space-y-3 list-none">
              {project.techChallenges.map((challenge, i) => (
                <li key={i} className="flex items-start text-lg leading-relaxed text-gray-700">
                  <span className="inline-block w-2 h-2 mt-2.5 mr-3 bg-black rounded-sm shrink-0"></span>
                  {bt(challenge)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 pb-2 mb-4 text-[#F4D330]">{t("项目成果", "Outcomes")}</h2>
            <p className="text-lg leading-relaxed text-gray-700">{bt(project.outcomes)}</p>
          </section>

          <section className="bg-gray-900 text-gray-300 p-8 rounded-sm border-2 border-black pixel-shadow font-mono text-sm">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <span className="text-[#4DA65C] mr-2">{">"}</span>
              {t("复盘与思考", "Reflection & Takeaways")}
            </h2>
            <p className="leading-relaxed">
              {bt(project.reflection)}
            </p>
          </section>
        </div>
      </article>

      <div className="mt-12 text-center">
        <Link
          to={`/demo/${id}`}
          className="inline-flex items-center text-lg font-bold text-gray-800 hover:text-[#1D79E4] transition-colors underline decoration-2 underline-offset-4"
        >
          {t("前往交互式演示", "Proceed to interactive demo")} <ArrowUpRight className="w-5 h-5 ml-1" />
        </Link>
      </div>
    </div>
  );
}

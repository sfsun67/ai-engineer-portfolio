import type { TimelineStep } from './types'

export const TIMELINE: TimelineStep[] = [
  // ── Step 0: 任务启动 ─────────────────────────────────────────
  {
    statusLabel: '正在连接',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '已连接到分镜工作流服务。\n正在基于你提供的 storyboard 启动视频生成任务。',
      },
      {
        sender: 'system',
        variant: 'config',
        config: {
          items: [
            { label: '模式', value: '交互式（审核点暂停）' },
            { label: '输入文件', value: 'storyboard.json' },
            { label: '目标时长', value: '40 秒' },
            { label: '场景数', value: '62' },
            { label: '多模态 brainstorm', value: '是' },
            { label: '场景匹配', value: '是' },
            { label: '背景音乐', value: '关闭' },
          ],
        },
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '初始化工作流引擎...', delay: 200 },
      { node: 'Orchestrator', level: 'info', message: '加载分镜数据: 62 个场景', delay: 600 },
      { node: 'Orchestrator', level: 'success', message: '工作流配置验证通过', delay: 1000 },
    ],
  },

  // ── Step 1: 工作流启动 ────────────────────────────────────────
  {
    statusLabel: '正在选择开场镜头',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '分镜工作流已启动。\n工作流 ID：66a030fd-ef42-459f-bd37-6b399d172611\n当前状态：运行中',
      },
      {
        sender: 'agent',
        variant: 'text',
        text: '正在处理首镜选择与分镜编排，请稍候。\n你可以在审核点对结果进行通过、重试或修改。',
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '工作流 66a030fd 已创建', delay: 100 },
      { node: 'SceneArranger', level: 'info', message: '开始首镜选择...', delay: 400 },
      { node: 'SceneArranger', level: 'info', message: '分析 62 个候选场景的视觉冲击力', delay: 800 },
      { node: 'SceneArranger', level: 'success', message: '首镜确定: segment_002 (雷光审判)', delay: 1500 },
    ],
  },

  // ── Step 2: 编排分镜 ──────────────────────────────────────────
  {
    statusLabel: '正在编排分镜',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '正在进行分镜编排与多模态精修...',
      },
    ],
    logs: [
      { node: 'Brainstorm', level: 'info', message: '启动多模态 brainstorm 引擎', delay: 200 },
      { node: 'Brainstorm', level: 'info', message: '生成广告脚本框架...', delay: 600 },
      { node: 'SceneArranger', level: 'info', message: '场景排列: 从 62 个候选中筛选 10 个片段', delay: 1200 },
      { node: 'SceneArranger', level: 'info', message: '优化情绪曲线: 压抑→反抗→绝望→觉醒→希望', delay: 1800 },
      { node: 'Validator', level: 'info', message: '校验音画匹配度...', delay: 2400 },
      { node: 'Validator', level: 'success', message: '匹配验证通过，得分 95/100', delay: 3000 },
      { node: 'Orchestrator', level: 'info', message: '进入审核点: scene_arrangement', delay: 3200 },
    ],
  },

  // ── Step 3: 首轮分镜摘要 ──────────────────────────────────────
  {
    statusLabel: '等待你审核分镜',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '已生成第一版分镜编排，进入审核点：scene_arrangement。\n请审核画面顺序与口播文案。',
      },
      {
        sender: 'agent',
        variant: 'text',
        text: '当前版本共 10 个片段，时长约 40 秒。\n核心结构：\n  - 开场：雷光审判\n  - 中段：洪水 / 囚笼 / 战斗 / 觉醒 / 组队\n  - 结尾：阴谋 / 天使降临 / 悬念收束',
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '等待用户审核 scene_arrangement...', delay: 100 },
    ],
  },

  // ── Step 4: 首轮分镜详情 + 评分 + checkpoint 1 ────────────────
  {
    statusLabel: '等待你审核分镜',
    messages: [
      {
        sender: 'agent',
        variant: 'segment-card',
        segments: [
          { index: 1, timeRange: '00:00 - 00:03', emotion: '压抑', emotionColor: '#E43B44', line: '当毁灭的雷光撕裂天际，审判已然降临。', asset: 'segment_002.mp4' },
          { index: 2, timeRange: '00:03 - 00:06', emotion: '反抗', emotionColor: '#1D79E4', line: '在绝望的深渊前，或是毁灭，或是拔刀反抗！', asset: 'segment_004.mp4' },
          { index: 3, timeRange: '00:06 - 00:10', emotion: '绝望', emotionColor: '#8B5CF6', line: '秩序的闸门正在崩塌，汹涌的洪流即将吞噬这世间的一切。', asset: 'segment_010.mp4' },
          { index: 4, timeRange: '00:10 - 00:14', emotion: '压抑', emotionColor: '#E43B44', line: '当牢笼的铁锁紧紧咬住希望，唯有怒火能将它熔断。', asset: 'segment_009.mp4' },
          { index: 5, timeRange: '00:14 - 00:18', emotion: '燃', emotionColor: '#F48B29', line: '在这场末日的盛宴上，让手中的利刃说话。', asset: 'segment_020.mp4' },
          { index: 6, timeRange: '00:18 - 00:22', emotion: '觉醒', emotionColor: '#4DA65C', line: '当黎明刺穿黑暗，觉醒的力量已势不可挡。', asset: 'segment_023.mp4' },
          { index: 7, timeRange: '00:22 - 00:26', emotion: '团结', emotionColor: '#1D79E4', line: '并肩而立，我们是彼此最后的信仰。', asset: 'segment_027.mp4' },
          { index: 8, timeRange: '00:26 - 00:30', emotion: '神秘', emotionColor: '#8B5CF6', line: '阴谋的暗流已渗入每一道裂缝，真相即将浮出水面。', asset: 'segment_034.mp4' },
          { index: 9, timeRange: '00:30 - 00:35', emotion: '希望', emotionColor: '#4DA65C', line: '天使从裂隙中降临，带来的是救赎还是审判？', asset: 'segment_037.mp4' },
          { index: 10, timeRange: '00:35 - 00:40', emotion: '悬念', emotionColor: '#F4D330', line: '故事远未结束。下一章，由你书写。', asset: 'segment_042.mp4' },
        ],
        instant: true,
      },
      {
        sender: 'system',
        variant: 'score',
        score: {
          score: 95,
          conclusion: '整体合理，音画匹配度高。',
          suggestions: [
            '"让手中的利刃说话"略显套路',
            '"阴谋的暗流"与前一镜衔接略跳，可通过转场音效缓冲',
          ],
        },
      },
    ],
    logs: [],
    checkpoint: {
      correctChoice: '重试',
      choices: ['通过', '重试', '精修'],
      wrongChoiceMessage: '当前 Demo 仅支持按预设路径体验，请选择「重试」继续。',
      showFeedbackInput: true,
      defaultFeedback: '突出原神特色',
      userMessage: '重试，突出原神特色',
    },
  },

  // ── Step 5: 收到反馈 ──────────────────────────────────────────
  {
    statusLabel: '正在处理反馈',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '已收到你的反馈："突出原神特色"\n正在重新生成分镜方案。',
      },
      {
        sender: 'agent',
        variant: 'text',
        text: '本轮会重点增强以下方向：\n  - 原神角色辨识度\n  - 世界观关键词（提瓦特 / 七国 / 执行官 / 元素反应）\n  - 更贴合原神调性的文案风格',
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '收到用户反馈: "突出原神特色"', delay: 100 },
      { node: 'Orchestrator', level: 'info', message: '触发重试流程，保留首镜选择', delay: 400 },
      { node: 'Brainstorm', level: 'info', message: '重新加载品牌词库: 原神/提瓦特/七国/元素反应...', delay: 800 },
    ],
  },

  // ── Step 6: 重新编排 ──────────────────────────────────────────
  {
    statusLabel: '正在重新编排分镜',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '正在重新完成：\n  - 场景重排\n  - 多模态精修\n  - 台词与画面匹配验证',
      },
    ],
    logs: [
      { node: 'SceneArranger', level: 'info', message: '重新排列场景序列...', delay: 300 },
      { node: 'Brainstorm', level: 'info', message: '融入原神世界观元素: 雷电将军/万叶/执行官', delay: 800 },
      { node: 'SceneArranger', level: 'info', message: '优化片段数量: 10 → 9，提升节奏紧凑度', delay: 1400 },
      { node: 'Brainstorm', level: 'info', message: '文案精修: 注入"提瓦特""七国伙伴""元素反应"', delay: 2000 },
      { node: 'Validator', level: 'info', message: '重新校验音画匹配...', delay: 2600 },
      { node: 'Validator', level: 'success', message: '匹配验证通过，得分 92/100', delay: 3200 },
      { node: 'Orchestrator', level: 'info', message: '进入审核点: scene_arrangement (第二轮)', delay: 3400 },
    ],
  },

  // ── Step 7: 二轮分镜审核 + checkpoint 2 ───────────────────────
  {
    statusLabel: '等待你审核分镜',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '已根据你的反馈完成第二版分镜，进入审核点：scene_arrangement。',
      },
      {
        sender: 'agent',
        variant: 'text',
        text: '当前版本共 9 个片段，总时长约 30 秒。\n相比上一版，已明显强化《原神》特色：\n  - 雷电将军 / 万叶 / 执行官 / 七国伙伴 / 元素反应 / 提瓦特\n  - 结尾加入明确下载召回：立即下载《原神》',
      },
      {
        sender: 'agent',
        variant: 'segment-card',
        segments: [
          { index: 1, timeRange: '00:00 - 00:03', emotion: '压抑', emotionColor: '#E43B44', line: '当毁灭的雷光撕裂苍穹，神威降下无情的审判。', asset: 'segment_002.mp4' },
          { index: 2, timeRange: '00:03 - 00:05', emotion: '绝望', emotionColor: '#8B5CF6', line: '末日洪水，彻底冲溃了人类最后的防线。', asset: 'segment_010.mp4' },
          { index: 3, timeRange: '00:05 - 00:08', emotion: '神秘', emotionColor: '#8B5CF6', line: '来自至冬的执行官，誓以此身改写战场的法则。', asset: 'segment_035.mp4' },
          { index: 4, timeRange: '00:08 - 00:11', emotion: '觉醒', emotionColor: '#4DA65C', line: '但凡人的意志，终将点亮直面神明的奇迹！', asset: 'segment_004.mp4' },
          { index: 5, timeRange: '00:11 - 00:13', emotion: '燃', emotionColor: '#F48B29', line: '集结七国伙伴，引爆元素反应，', asset: 'segment_049.mp4' },
          { index: 6, timeRange: '00:13 - 00:15', emotion: '燃', emotionColor: '#F48B29', line: '飞檐走壁，驭龙而行，无可阻挡！', asset: 'segment_038.mp4' },
          { index: 7, timeRange: '00:15 - 00:19', emotion: '悲壮', emotionColor: '#E43B44', line: '哪怕身陷无尽深渊，我愿为你燃尽最后一滴血。', asset: 'segment_020.mp4' },
          { index: 8, timeRange: '00:19 - 00:23', emotion: '燃', emotionColor: '#F48B29', line: '挥出这一拳，击碎绝望，重铸世界的黎明！', asset: 'segment_040.mp4' },
          { index: 9, timeRange: '00:23 - 00:30', emotion: '希望', emotionColor: '#4DA65C', line: '旅途的终点或许是新的开始。\n跨越星辰与深渊，我在提瓦特等你。\n立即下载《原神》。', asset: 'segment_062.mp4' },
        ],
        instant: true,
      },
      {
        sender: 'system',
        variant: 'score',
        score: {
          score: 92,
          conclusion: '整体合理，原神辨识度明显增强。',
          suggestions: [
            '"燃尽最后一滴血"略偏中二，可替换为更温柔的表达',
            '第 3 句到第 4 句之间可增加"然而"强化转折',
          ],
        },
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '等待用户审核 scene_arrangement (v2)...', delay: 100 },
    ],
    checkpoint: {
      correctChoice: '通过',
      choices: ['通过', '精修', '重试'],
      wrongChoiceMessage: '该 Demo 使用固定脚本化数据，当前阶段仅支持选择「通过」。',
      userMessage: '通过',
    },
  },

  // ── Step 8: TTS 生成 ──────────────────────────────────────────
  {
    statusLabel: '正在生成配音',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '分镜已确认，正在批量生成 TTS。\n当前共需生成 9 个语音片段。',
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '分镜审核通过，启动 TTS 生成', delay: 100 },
      { node: 'TTSEngine', level: 'info', message: '初始化 TTS 引擎 (dubbingx backend)', delay: 400 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 1/9: "当毁灭的雷光撕裂苍穹..."', delay: 800 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 2/9: "末日洪水..."', delay: 1200 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 3/9: "来自至冬的执行官..."', delay: 1600 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 4/9: "但凡人的意志..."', delay: 2000 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 5/9: "集结七国伙伴..."', delay: 2300 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 6/9: "飞檐走壁..."', delay: 2600 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 7/9: "哪怕身陷无尽深渊..."', delay: 2900 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 8/9: "挥出这一拳..."', delay: 3200 },
      { node: 'TTSEngine', level: 'info', message: '生成片段 9/9: "旅途的终点..."', delay: 3500 },
      { node: 'TTSEngine', level: 'success', message: 'TTS 全部完成: 9/9 成功, 0 失败', delay: 3800 },
    ],
  },

  // ── Step 9: TTS 审核 + checkpoint 3 ───────────────────────────
  {
    statusLabel: '等待你确认配音',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: 'TTS 已完成：\n  - 总数：9\n  - 成功：9\n  - 失败：0',
      },
      {
        sender: 'agent',
        variant: 'tts-card',
        ttsCards: [
          { index: 1, text: '当毁灭的雷光撕裂苍穹，神威降下无情的审判。' },
          { index: 2, text: '末日洪水，彻底冲溃了人类最后的防线。' },
          { index: 3, text: '来自至冬的执行官，誓以此身改写战场的法则。' },
          { index: 4, text: '但凡人的意志，终将点亮直面神明的奇迹！' },
          { index: 5, text: '集结七国伙伴，引爆元素反应，' },
          { index: 6, text: '飞檐走壁，驭龙而行，无可阻挡！' },
          { index: 7, text: '哪怕身陷无尽深渊，我愿为你燃尽最后一滴血。' },
          { index: 8, text: '挥出这一拳，击碎绝望，重铸世界的黎明！' },
          { index: 9, text: '旅途的终点或许是新的开始。跨越星辰与深渊，我在提瓦特等你。立即下载《原神》。' },
        ],
        instant: true,
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: '进入审核点: tts_review', delay: 100 },
    ],
    checkpoint: {
      correctChoice: '通过',
      choices: ['通过', '重试指定片段'],
      wrongChoiceMessage: '该 Demo 使用固定脚本化数据，当前阶段仅支持选择「通过」。',
      userMessage: '通过',
    },
  },

  // ── Step 10: 最终合成 ─────────────────────────────────────────
  {
    statusLabel: '正在导出最终视频',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '已通过 TTS 审核，正在导出最终视频。',
      },
      {
        sender: 'system',
        variant: 'config',
        config: {
          items: [
            { label: '当前处理', value: '拼接 9 个视频片段' },
            { label: '字幕', value: '已启用' },
            { label: '背景音乐', value: '未启用' },
            { label: '输出分辨率', value: '1920x1080' },
          ],
        },
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'info', message: 'TTS 审核通过，启动视频合成', delay: 100 },
      { node: 'VideoCompositor', level: 'info', message: '初始化合成引擎...', delay: 400 },
      { node: 'VideoCompositor', level: 'info', message: '拼接视频片段 1-3/9', delay: 1000 },
      { node: 'VideoCompositor', level: 'info', message: '拼接视频片段 4-6/9', delay: 1800 },
      { node: 'VideoCompositor', level: 'info', message: '拼接视频片段 7-9/9', delay: 2600 },
      { node: 'VideoCompositor', level: 'info', message: '按语音时长裁切画面...', delay: 3200 },
      { node: 'VideoCompositor', level: 'info', message: '烧录字幕轨道...', delay: 3800 },
      { node: 'VideoCompositor', level: 'info', message: '编码输出 H.264 1920x1080...', delay: 4400 },
      { node: 'VideoCompositor', level: 'success', message: '最终视频导出完成: 33.74s, 21MB', delay: 5000 },
    ],
  },

  // ── Step 11: 完成 ─────────────────────────────────────────────
  {
    statusLabel: '已完成',
    messages: [
      {
        sender: 'system',
        variant: 'text',
        text: '视频已生成完成。\n  - 最终时长：33.74 秒\n  - 输出文件：final_video_with_subtitles_66a030fd.mp4',
      },
      {
        sender: 'system',
        variant: 'summary',
        summary: {
          segments: 9,
          ttsSuccess: '9/9',
          subtitles: '已导出',
          duration: '33.74 秒',
          files: [
            { name: 'final_video_with_subtitles_66a030fd.mp4', size: '21MB' },
            { name: 'final_video_with_subtitles_66a030fd.srt', size: '4KB' },
          ],
        },
        instant: true,
      },
    ],
    logs: [
      { node: 'Orchestrator', level: 'success', message: '工作流 66a030fd 已完成', delay: 100 },
      { node: 'Orchestrator', level: 'info', message: '总耗时: 4 分 32 秒', delay: 300 },
      { node: 'Orchestrator', level: 'info', message: '资源清理完成', delay: 500 },
    ],
  },
]

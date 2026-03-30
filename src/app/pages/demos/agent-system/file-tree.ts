import type { FileNode } from './types'

// ── Mock content snippets ──────────────────────────────────────

const STORYBOARD_PREVIEW = `{
  "task_id": "url_test_mcp_storyboard_20260325_112933",
  "total_scenes": 62,
  "scenes": [
    {
      "scene_id": 1,
      "visual_summary": "雷电劈裂天空，城市废墟中燃起火焰",
      "emotion": "压抑",
      "characters": ["雷电将军"],
      "marketing_intent": "制造视觉冲击，吸引注意力"
    },
    {
      "scene_id": 2,
      "visual_summary": "洪水涌入城镇，人群仓皇逃离",
      "emotion": "绝望",
      "characters": [],
      "marketing_intent": "渲染末日氛围，烘托危机感"
    }
  ]
  // ... 共 62 个场景
}`

const SCENE_DB_PREVIEW = `{
  "workflow_id": "66a030fd-ef42-459f-bd37-6b399d172611",
  "total_segments": 62,
  "segments": [
    {
      "segment_id": "segment_001",
      "duration": 3.2,
      "file": "merged_segments/segment_001.mp4",
      "visual_tags": ["雷电", "天空", "审判"]
    },
    {
      "segment_id": "segment_002",
      "duration": 4.1,
      "file": "merged_segments/segment_002.mp4",
      "visual_tags": ["战斗", "反抗", "深渊"]
    }
  ]
  // ... 共 62 个片段
}`

const TTS_SUMMARY_PREVIEW = `{
  "total": 9,
  "success": 9,
  "failed": 0,
  "timestamp": "2026-03-27T17:40:14.653204",
  "results": [
    {
      "index": 1,
      "segment_id": "FIRST_0",
      "start_time": "00:00",
      "end_time": "00:03",
      "text": "当毁灭的雷光撕裂苍穹，神威降下无情的审判。",
      "backend": "dubbingx",
      "success": true
    },
    {
      "index": 2,
      "segment_id": 10,
      "start_time": "00:03",
      "end_time": "00:05",
      "text": "末日洪水，彻底冲溃了人类最后的防线。",
      "backend": "dubbingx",
      "success": true
    }
  ]
  // ... 共 9 条 TTS 结果
}`

const SRT_PREVIEW = `1
00:00:00,000 --> 00:00:03,710
当毁灭的雷光撕裂苍穹，神威降下无情的审判。

2
00:00:03,710 --> 00:00:06,660
末日洪水，彻底冲溃了人类最后的防线。

3
00:00:06,660 --> 00:00:10,650
来自至冬的执行官，誓以此身改写战场的法则。

4
00:00:10,650 --> 00:00:14,690
但凡人的意志，终将点亮直面神明的奇迹！

5
00:00:14,690 --> 00:00:17,179
集结七国伙伴，引爆元素反应，

6
00:00:17,179 --> 00:00:20,089
飞檐走壁，驭龙而行，无可阻挡！

7
00:00:20,089 --> 00:00:23,460
哪怕身陷无尽深渊，我愿为你燃尽最后一滴血。

8
00:00:23,460 --> 00:00:26,990
挥出这一拳，击碎绝望，重铸世界的黎明！

9
00:00:26,990 --> 00:00:33,740
旅途的终点或许是新的开始。
跨越星辰与深渊，我在提瓦特等你。
立即下载《原神》。`

// ── File tree definition ───────────────────────────────────────

export const FILE_TREE: FileNode[] = [
  {
    id: 'root',
    name: 'pipeline_66a030fd',
    type: 'folder',
    appearsAtStep: 0,
    children: [
      {
        id: 'input-folder',
        name: 'input',
        type: 'folder',
        appearsAtStep: 0,
        children: [
          {
            id: 'storyboard',
            name: 'storyboard.json',
            type: 'file',
            appearsAtStep: 0,
            fileType: 'json',
            mockSize: '71KB',
            mockContent: STORYBOARD_PREVIEW,
          },
        ],
      },
      {
        id: 'output-folder',
        name: 'output',
        type: 'folder',
        appearsAtStep: 3,
        children: [
          {
            id: 'scene-db',
            name: 'scene_database.json',
            type: 'file',
            appearsAtStep: 3,
            fileType: 'json',
            mockSize: '24KB',
            mockContent: SCENE_DB_PREVIEW,
          },
          {
            id: 'segments-folder',
            name: 'merged_segments',
            type: 'folder',
            appearsAtStep: 4,
            children: [
              { id: 'seg-002', name: 'segment_002.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '5.2MB' },
              { id: 'seg-004', name: 'segment_004.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '3.8MB' },
              { id: 'seg-009', name: 'segment_009.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '6.1MB' },
              { id: 'seg-010', name: 'segment_010.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '4.5MB' },
              { id: 'seg-020', name: 'segment_020.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '7.2MB' },
              { id: 'seg-023', name: 'segment_023.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '3.1MB' },
              { id: 'seg-027', name: 'segment_027.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '5.8MB' },
              { id: 'seg-034', name: 'segment_034.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '4.9MB' },
              { id: 'seg-035', name: 'segment_035.mp4', type: 'file', appearsAtStep: 7, fileType: 'video', mockSize: '6.3MB' },
              { id: 'seg-037', name: 'segment_037.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '2.4MB' },
              { id: 'seg-038', name: 'segment_038.mp4', type: 'file', appearsAtStep: 7, fileType: 'video', mockSize: '4.1MB' },
              { id: 'seg-040', name: 'segment_040.mp4', type: 'file', appearsAtStep: 7, fileType: 'video', mockSize: '5.5MB' },
              { id: 'seg-042', name: 'segment_042.mp4', type: 'file', appearsAtStep: 4, fileType: 'video', mockSize: '3.7MB' },
              { id: 'seg-049', name: 'segment_049.mp4', type: 'file', appearsAtStep: 7, fileType: 'video', mockSize: '2.9MB' },
              { id: 'seg-062', name: 'segment_062.mp4', type: 'file', appearsAtStep: 7, fileType: 'video', mockSize: '88MB' },
            ],
          },
          {
            id: 'tts-folder',
            name: 'tts',
            type: 'folder',
            appearsAtStep: 9,
            children: [
              { id: 'tts-summary', name: 'tts_summary.json', type: 'file', appearsAtStep: 9, fileType: 'json', mockSize: '2KB', mockContent: TTS_SUMMARY_PREVIEW },
              { id: 'tts-seg-1', name: 'segment_FIRST_0.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '412KB' },
              { id: 'tts-seg-2', name: 'segment_010.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '236KB' },
              { id: 'tts-seg-3', name: 'segment_035.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '348KB' },
              { id: 'tts-seg-4', name: 'segment_004.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '310KB' },
              { id: 'tts-seg-5', name: 'segment_049.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '256KB' },
              { id: 'tts-seg-6', name: 'segment_038.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '278KB' },
              { id: 'tts-seg-7', name: 'segment_020.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '636KB' },
              { id: 'tts-seg-8', name: 'segment_040.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '298KB' },
              { id: 'tts-seg-9', name: 'segment_062.wav', type: 'file', appearsAtStep: 9, fileType: 'audio', mockSize: '520KB' },
            ],
          },
          {
            id: 'final-video',
            name: 'final_video_with_subtitles_66a030fd.mp4',
            type: 'file',
            appearsAtStep: 11,
            fileType: 'video',
            mockSize: '21MB',
          },
          {
            id: 'subtitles',
            name: 'final_video_with_subtitles_66a030fd.srt',
            type: 'file',
            appearsAtStep: 11,
            fileType: 'text',
            mockSize: '4KB',
            mockContent: SRT_PREVIEW,
          },
        ],
      },
    ],
  },
]

/** Recursively filter the tree to only include nodes visible at the given step */
export function getVisibleTree(nodes: FileNode[], currentStep: number): FileNode[] {
  return nodes
    .filter((node) => node.appearsAtStep <= currentStep)
    .map((node) => {
      if (node.children) {
        return { ...node, children: getVisibleTree(node.children, currentStep) }
      }
      return node
    })
}

/** Collect all file IDs visible at a given step */
export function getVisibleFileIds(nodes: FileNode[], currentStep: number): Set<string> {
  const ids = new Set<string>()
  function walk(list: FileNode[]) {
    for (const node of list) {
      if (node.appearsAtStep <= currentStep) {
        ids.add(node.id)
        if (node.children) walk(node.children)
      }
    }
  }
  walk(nodes)
  return ids
}

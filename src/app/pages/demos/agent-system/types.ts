// ── Message types ──────────────────────────────────────────────

export type MessageSender = 'system' | 'user' | 'agent'

/** Render hint — how the message body should be displayed */
export type MessageVariant =
  | 'text'           // plain text paragraph
  | 'config'         // key-value config summary
  | 'segment-card'   // storyboard segment card (with emotion color bar)
  | 'score'          // auto-evaluation score block
  | 'tts-card'       // TTS playback card
  | 'summary'        // final result summary card

/** A single segment card inside a message */
export interface SegmentCardData {
  index: number
  timeRange: string        // e.g. "00:00 - 00:03"
  emotion?: string
  emotionColor?: string    // hex
  line: string             // 台词
  asset?: string           // segment_002.mp4
}

/** Score / evaluation block */
export interface ScoreData {
  score: number
  conclusion: string
  suggestions: string[]
}

/** TTS preview card */
export interface TTSCardData {
  index: number
  text: string
}

/** Final summary card */
export interface SummaryData {
  segments: number
  ttsSuccess: string       // "9/9"
  subtitles: string
  duration: string
  files: { name: string; size: string }[]
}

/** Config key-value pairs */
export interface ConfigData {
  items: { label: string; value: string }[]
}

/** Definition of a chat message (used in timeline data) */
export interface ChatMessageDef {
  sender: MessageSender
  variant: MessageVariant
  text?: string
  segments?: SegmentCardData[]
  score?: ScoreData
  ttsCards?: TTSCardData[]
  summary?: SummaryData
  config?: ConfigData
  /** If true, skip typewriter and render instantly */
  instant?: boolean
}

/** Runtime chat message (with unique id) */
export interface ChatMessage extends ChatMessageDef {
  id: string
}

// ── Log types ──────────────────────────────────────────────────

export type LogLevel = 'info' | 'warn' | 'error' | 'success'

export type LogNodeName =
  | 'Orchestrator'
  | 'SceneArranger'
  | 'Brainstorm'
  | 'TTSEngine'
  | 'VideoCompositor'
  | 'Validator'

export interface LogEntryDef {
  node: LogNodeName
  level: LogLevel
  message: string
  /** Delay in ms from the start of the step before this log appears */
  delay: number
}

export interface LogEntry extends LogEntryDef {
  id: string
  timestamp: string          // HH:MM:SS.ms
}

// ── Checkpoint types ───────────────────────────────────────────

export interface CheckpointDef {
  /** The only choice that advances the flow */
  correctChoice: string
  /** All choices shown to the user */
  choices: string[]
  /** Message shown when user picks the wrong choice */
  wrongChoiceMessage: string
  /** If true, show a feedback textarea after correct choice (checkpoint 1) */
  showFeedbackInput?: boolean
  /** Pre-filled feedback text */
  defaultFeedback?: string
  /** The user message appended to chat after choosing correctly */
  userMessage: string
}

// ── File tree types ────────────────────────────────────────────

export type FileType = 'json' | 'text' | 'video' | 'audio'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  /** This node becomes visible when timelineIndex >= appearsAtStep */
  appearsAtStep: number
  fileType?: FileType
  mockSize?: string
  /** Mock content for preview (JSON string or plain text) */
  mockContent?: string
}

// ── Timeline step ──────────────────────────────────────────────

export interface TimelineStep {
  /** Human-readable status label shown in the status bar */
  statusLabel: string
  /** Chat messages to output during this step */
  messages: ChatMessageDef[]
  /** Log entries emitted during this step */
  logs: LogEntryDef[]
  /** Optional interactive checkpoint at the end of this step */
  checkpoint?: CheckpointDef
  /** File IDs that become visible at this step */
  newFiles?: string[]
}

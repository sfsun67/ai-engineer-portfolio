import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Bot, User, Send, CheckCircle, AlertTriangle, Play, RotateCcw, FileText, Eye } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog'
import { Separator } from '@/app/components/ui/separator'
import type { ChatMessage, CheckpointDef, SegmentCardData, ScoreData, TTSCardData, SummaryData, ConfigData } from './types'
import { StatusBar } from './StatusBar'

// ── Segment card ───────────────────────────────────────────────

function SegmentCards({ segments }: { segments: SegmentCardData[] }) {
  return (
    <div className="space-y-2">
      {segments.map((seg) => (
        <div
          key={seg.index}
          className="flex border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <div
            className="w-1 shrink-0"
            style={{ backgroundColor: seg.emotionColor ?? '#999' }}
          />
          <div className="flex-1 p-2.5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <span>片段 {seg.index}</span>
              <span>|</span>
              <span>{seg.timeRange}</span>
              {seg.emotion && (
                <>
                  <span>|</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: `${seg.emotionColor}20`, color: seg.emotionColor }}
                  >
                    {seg.emotion}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{seg.line}</p>
            {seg.asset && (
              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                <Play className="w-2.5 h-2.5" />
                {seg.asset}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Score block ────────────────────────────────────────────────

function ScoreBlock({ score }: { score: ScoreData }) {
  const scoreColor = score.score >= 90 ? '#4DA65C' : score.score >= 70 ? '#F4D330' : '#E43B44'
  return (
    <Card className="border-l-4" style={{ borderLeftColor: scoreColor }}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold font-mono" style={{ color: scoreColor }}>
            {score.score}
          </span>
          <span className="text-sm text-gray-600">{score.conclusion}</span>
        </div>
        {score.suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">建议优化点：</p>
              {score.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <AlertTriangle className="w-3 h-3 text-[#F4D330] mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ── TTS cards ──────────────────────────────────────────────────

function TTSCards({ cards }: { cards: TTSCardData[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-500 font-medium">你可以试听以下片段：</p>
      {cards.map((card) => (
        <div
          key={card.index}
          className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white"
        >
          <button className="w-7 h-7 rounded-full bg-[#F48B29]/10 flex items-center justify-center shrink-0 hover:bg-[#F48B29]/20 transition-colors">
            <Play className="w-3 h-3 text-[#F48B29] ml-0.5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-mono">TTS 片段 {card.index}</p>
            <p className="text-sm text-gray-700 truncate">{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Config summary ─────────────────────────────────────────────

function ConfigBlock({ config }: { config: ConfigData }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
      <p className="text-xs text-gray-500 font-medium mb-2">本次任务配置</p>
      {config.items.map((item, i) => (
        <div key={i} className="flex items-center text-sm">
          <span className="text-gray-500 w-28 shrink-0 font-mono text-xs">{item.label}</span>
          <span className="text-gray-800">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Summary card ───────────────────────────────────────────────

function SummaryCard({ summary, onViewFiles }: { summary: SummaryData; onViewFiles?: () => void }) {
  return (
    <Card className="border-t-4 border-t-[#4DA65C]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#4DA65C]" />
          <span className="font-bold text-gray-800">任务完成</span>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500 text-xs">分镜数</span>
            <p className="font-mono font-medium">{summary.segments}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">TTS</span>
            <p className="font-mono font-medium">{summary.ttsSuccess} 成功</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">字幕</span>
            <p className="font-mono font-medium">{summary.subtitles}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">时长</span>
            <p className="font-mono font-medium">{summary.duration}</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-1">
          {summary.files.map((f) => (
            <div key={f.name} className="flex items-center gap-2 text-sm">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-mono text-gray-700">{f.name}</span>
              <span className="text-xs text-gray-400">({f.size})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Message bubble ─────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
          isUser
            ? 'bg-[#1D79E4] border-[#1D79E4]'
            : msg.sender === 'agent'
              ? 'bg-[#F48B29]/10 border-[#F48B29]/30'
              : 'bg-gray-100 border-gray-200'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Bot className={`w-3.5 h-3.5 ${msg.sender === 'agent' ? 'text-[#F48B29]' : 'text-gray-500'}`} />
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : ''}`}>
        {msg.variant === 'text' && msg.text && (
          <div
            className={`px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-line ${
              isUser
                ? 'bg-[#1D79E4] text-white rounded-tr-none'
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            {msg.text}
          </div>
        )}
        {msg.variant === 'config' && msg.config && <ConfigBlock config={msg.config} />}
        {msg.variant === 'segment-card' && msg.segments && <SegmentCards segments={msg.segments} />}
        {msg.variant === 'score' && msg.score && <ScoreBlock score={msg.score} />}
        {msg.variant === 'tts-card' && msg.ttsCards && <TTSCards cards={msg.ttsCards} />}
        {msg.variant === 'summary' && msg.summary && <SummaryCard summary={msg.summary} />}
      </div>
    </motion.div>
  )
}

// ── Checkpoint UI ──────────────────────────────────────────────

function CheckpointUI({
  checkpoint,
  onChoice,
}: {
  checkpoint: CheckpointDef
  onChoice: (choice: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-8"
    >
      <Card className="border-[#1D79E4]/30 border-l-4 border-l-[#1D79E4]">
        <CardContent className="p-3">
          <p className="text-sm text-gray-600 mb-3">请选择操作：</p>
          <div className="flex flex-wrap gap-2">
            {checkpoint.choices.map((choice) => {
              const isCorrect = choice === checkpoint.correctChoice
              return (
                <Button
                  key={choice}
                  variant={isCorrect ? 'default' : 'outline'}
                  size="sm"
                  className={`font-mono text-xs pixel-shadow-sm ${
                    isCorrect
                      ? 'bg-[#4DA65C] hover:bg-[#4DA65C]/90 border-2 border-black text-white'
                      : 'border-2 border-black hover:bg-gray-50'
                  }`}
                  onClick={() => onChoice(choice)}
                >
                  {choice}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Feedback input (for checkpoint 1) ──────────────────────────

function FeedbackInput({
  defaultValue,
  onSubmit,
}: {
  defaultValue: string
  onSubmit: () => void
}) {
  const [text, setText] = useState(defaultValue)

  // Revert to default after 500ms if user edits
  useEffect(() => {
    if (text === defaultValue) return
    const timer = window.setTimeout(() => setText(defaultValue), 500)
    return () => clearTimeout(timer)
  }, [text, defaultValue])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 justify-end px-2"
    >
      <div className="flex items-end gap-2 max-w-[80%]">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 mb-1 text-right">补充反馈</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border-2 border-[#1D79E4]/30 rounded-lg text-sm font-mono resize-none focus:outline-none focus:border-[#1D79E4] bg-white"
            rows={2}
          />
        </div>
        <Button
          size="sm"
          className="bg-[#1D79E4] hover:bg-[#1D79E4]/90 text-white gap-1 shrink-0 border-2 border-black mb-0.5 px-4 py-2"
          onClick={onSubmit}
        >
          <Send className="w-3 h-3 pointer-events-none" />
          发送
        </Button>
      </div>
      <div className="w-7 h-7 rounded-full bg-[#1D79E4] border border-[#1D79E4] flex items-center justify-center shrink-0">
        <User className="w-3.5 h-3.5 text-white" />
      </div>
    </motion.div>
  )
}

// ── Typing indicator ───────────────────────────────────────────

function TypingIndicator({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-gray-500" />
      </div>
      <div className="px-3 py-2 rounded-lg rounded-tl-none bg-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {text}
        <span className="inline-block w-2 ml-0.5 text-gray-400 animate-pulse">▊</span>
      </div>
    </div>
  )
}

// ── Main ChatPanel ─────────────────────────────────────────────

interface ChatPanelProps {
  messages: ChatMessage[]
  typingText: string | null
  isTyping: boolean
  statusLabel: string
  isComplete: boolean
  checkpoint: CheckpointDef | null
  showFeedbackInput: boolean
  wrongChoice: string | null
  onCheckpointChoice: (choice: string) => void
  onFeedbackSubmit: () => void
  onRestart: () => void
}

export function ChatPanel({
  messages,
  typingText,
  isTyping,
  statusLabel,
  isComplete,
  checkpoint,
  showFeedbackInput,
  wrongChoice,
  onCheckpointChoice,
  onFeedbackSubmit,
  onRestart,
}: ChatPanelProps) {

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <StatusBar label={statusLabel} isComplete={isComplete} isTyping={isTyping} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Typing indicator */}
        {typingText !== null && <TypingIndicator text={typingText} />}

        {/* Checkpoint */}
        {checkpoint && !showFeedbackInput && (
          <CheckpointUI checkpoint={checkpoint} onChoice={onCheckpointChoice} />
        )}

        {/* Feedback input for checkpoint 1 */}
        {showFeedbackInput && checkpoint && (
          <FeedbackInput
            defaultValue={checkpoint.defaultFeedback ?? ''}
            onSubmit={onFeedbackSubmit}
          />
        )}

        {/* Restart button when complete */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center pt-4"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-mono text-xs border-2 border-black pixel-shadow-sm"
              onClick={onRestart}
            >
              <RotateCcw className="w-3 h-3" />
              重新开始
            </Button>
          </motion.div>
        )}

      </div>

      {/* Wrong choice dialog */}
      <Dialog open={!!wrongChoice} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm">
          <DialogTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F4D330]" />
            操作提示
          </DialogTitle>
          <p className="text-sm text-gray-600">{wrongChoice}</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

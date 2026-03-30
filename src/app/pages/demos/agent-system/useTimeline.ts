import { useState, useRef, useCallback, useEffect } from 'react'
import type { ChatMessage, LogEntry, CheckpointDef } from './types'
import { TIMELINE } from './timeline'
import { FILE_TREE, getVisibleFileIds } from './file-tree'

const CHAR_INTERVAL_MS = 25

let _msgId = 0
const nextMsgId = () => `msg-${++_msgId}`
let _logId = 0
const nextLogId = () => `log-${++_logId}`

function formatTimestamp(baseMs: number): string {
  const d = new Date(baseMs)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export interface UseTimelineReturn {
  currentStep: number
  messages: ChatMessage[]
  logs: LogEntry[]
  typingText: string | null
  isTyping: boolean
  statusLabel: string
  visibleFileIds: Set<string>
  checkpoint: CheckpointDef | null
  showFeedbackInput: boolean
  wrongChoice: string | null
  handleCheckpointChoice: (choice: string) => void
  handleFeedbackSubmit: () => void
  isComplete: boolean
  start: () => void
  restart: () => void
}

export function useTimeline(): UseTimelineReturn {
  const [currentStep, setCurrentStep] = useState(-1)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [typingText, setTypingText] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [checkpoint, setCheckpoint] = useState<CheckpointDef | null>(null)
  const [showFeedbackInput, setShowFeedbackInput] = useState(false)
  const [wrongChoice, setWrongChoice] = useState<string | null>(null)

  const stepRef = useRef(-1)
  const timers = useRef<number[]>([])
  const isAdvancingRef = useRef(false)
  const baseTimeRef = useRef(Date.now())

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id))
    timers.current = []
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [clearAllTimers])

  const registerTimer = useCallback((fn: () => void, delay: number): number => {
    const id = window.setTimeout(fn, delay)
    timers.current.push(id)
    return id
  }, [])

  /** Type out a single text message, resolving when done */
  const typeMessage = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0
        setIsTyping(true)
        setTypingText('')
        const id = window.setInterval(() => {
          i++
          if (i <= text.length) {
            setTypingText(text.slice(0, i))
          } else {
            clearInterval(id)
            setTypingText(null)
            setIsTyping(false)
            resolve()
          }
        }, CHAR_INTERVAL_MS)
        timers.current.push(id)
      })
    },
    [],
  )

  /** Emit logs for a step with their configured delays */
  const emitLogs = useCallback(
    (step: number) => {
      const entry = TIMELINE[step]
      if (!entry) return
      for (const logDef of entry.logs) {
        registerTimer(() => {
          const logEntry: LogEntry = {
            ...logDef,
            id: nextLogId(),
            timestamp: formatTimestamp(baseTimeRef.current + logDef.delay),
          }
          setLogs((prev) => [...prev, logEntry])
          baseTimeRef.current += logDef.delay / 10 // advance base time slightly
        }, logDef.delay)
      }
    },
    [registerTimer],
  )

  /** Advance to the next step in the timeline */
  const advanceTimeline = useCallback(
    async (targetStep?: number) => {
      if (isAdvancingRef.current) return
      isAdvancingRef.current = true

      // Clear previous timers
      clearAllTimers()

      const step = targetStep ?? stepRef.current + 1
      if (step >= TIMELINE.length) {
        isAdvancingRef.current = false
        return
      }

      stepRef.current = step
      setCurrentStep(step)
      setCheckpoint(null)
      setShowFeedbackInput(false)

      const entry = TIMELINE[step]

      // Emit logs in parallel
      emitLogs(step)

      // Process messages sequentially
      for (const msgDef of entry.messages) {
        if (msgDef.instant || msgDef.variant !== 'text') {
          // Instant messages — no typewriter
          const msg: ChatMessage = { ...msgDef, id: nextMsgId() }
          setMessages((prev) => [...prev, msg])
          // Small delay between instant messages for visual pacing
          await new Promise<void>((r) => {
            registerTimer(r, 300)
          })
        } else if (msgDef.text) {
          // Typewriter for text messages
          await typeMessage(msgDef.text)
          const msg: ChatMessage = { ...msgDef, id: nextMsgId() }
          setMessages((prev) => [...prev, msg])
          // Gap between messages
          await new Promise<void>((r) => {
            registerTimer(r, 400)
          })
        }
      }

      isAdvancingRef.current = false

      // If this step has a checkpoint, show it and stop
      if (entry.checkpoint) {
        setCheckpoint(entry.checkpoint)
        return
      }

      // Auto-advance to next step after a pause
      registerTimer(() => {
        advanceTimeline(step + 1)
      }, 800)
    },
    [clearAllTimers, emitLogs, typeMessage, registerTimer],
  )

  const handleCheckpointChoice = useCallback(
    (choice: string) => {
      if (!checkpoint) return

      if (choice !== checkpoint.correctChoice) {
        setWrongChoice(checkpoint.wrongChoiceMessage)
        // Auto-dismiss after 3 seconds
        registerTimer(() => setWrongChoice(null), 3000)
        return
      }

      // Correct choice
      if (checkpoint.showFeedbackInput) {
        // Show the feedback textarea for checkpoint 1
        setShowFeedbackInput(true)
      } else {
        // Directly submit for checkpoints 2 & 3
        const userMsg: ChatMessage = {
          id: nextMsgId(),
          sender: 'user',
          variant: 'text',
          text: checkpoint.userMessage,
        }
        setMessages((prev) => [...prev, userMsg])
        setCheckpoint(null)
        registerTimer(() => {
          advanceTimeline()
        }, 600)
      }
    },
    [checkpoint, advanceTimeline, registerTimer],
  )

  const handleFeedbackSubmit = useCallback(() => {
    if (!checkpoint) return
    const userMsg: ChatMessage = {
      id: nextMsgId(),
      sender: 'user',
      variant: 'text',
      text: checkpoint.userMessage,
    }
    setMessages((prev) => [...prev, userMsg])
    setCheckpoint(null)
    setShowFeedbackInput(false)
    registerTimer(() => {
      advanceTimeline()
    }, 600)
  }, [checkpoint, advanceTimeline, registerTimer])

  const start = useCallback(() => {
    if (stepRef.current >= 0) return // already started
    baseTimeRef.current = Date.now()
    advanceTimeline(0)
  }, [advanceTimeline])

  const restart = useCallback(() => {
    clearAllTimers()
    isAdvancingRef.current = false
    stepRef.current = -1
    _msgId = 0
    _logId = 0
    setCurrentStep(-1)
    setMessages([])
    setLogs([])
    setTypingText(null)
    setIsTyping(false)
    setCheckpoint(null)
    setShowFeedbackInput(false)
    setWrongChoice(null)
    baseTimeRef.current = Date.now()
    // Start after a tick
    setTimeout(() => {
      advanceTimeline(0)
    }, 100)
  }, [clearAllTimers, advanceTimeline])

  const visibleFileIds = currentStep >= 0
    ? getVisibleFileIds(FILE_TREE, currentStep)
    : new Set<string>()

  const statusLabel = currentStep >= 0 && currentStep < TIMELINE.length
    ? TIMELINE[currentStep].statusLabel
    : '就绪'

  const isComplete = currentStep === TIMELINE.length - 1

  return {
    currentStep,
    messages,
    logs,
    typingText,
    isTyping,
    statusLabel,
    visibleFileIds,
    checkpoint,
    showFeedbackInput,
    handleCheckpointChoice,
    handleFeedbackSubmit,
    isComplete,
    start,
    restart,
    wrongChoice,
  }
}

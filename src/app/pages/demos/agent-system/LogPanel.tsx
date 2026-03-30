import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Terminal } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import type { LogEntry } from './types'

const LEVEL_COLORS: Record<string, string> = {
  info: 'text-gray-400',
  success: 'text-[#4DA65C]',
  warn: 'text-[#F4D330]',
  error: 'text-[#E43B44]',
}

const NODE_COLORS: Record<string, string> = {
  Orchestrator: 'bg-gray-700 text-gray-200',
  SceneArranger: 'bg-blue-900/60 text-blue-300',
  Brainstorm: 'bg-purple-900/60 text-purple-300',
  TTSEngine: 'bg-orange-900/60 text-orange-300',
  VideoCompositor: 'bg-green-900/60 text-green-300',
  Validator: 'bg-yellow-900/60 text-yellow-300',
}

interface LogPanelProps {
  logs: LogEntry[]
}

export function LogPanel({ logs }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs.length])

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-300">
      {/* Header */}
      <div className="h-10 border-b border-gray-800 flex items-center px-3 gap-2 shrink-0">
        <Terminal className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Runtime Logs</span>
        <span className="ml-auto text-xs font-mono text-gray-600">{logs.length}</span>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-[11px] leading-5">
        {logs.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">
            等待工作流启动...
          </div>
        )}
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-1.5 py-0.5"
          >
            <span className="text-gray-600 shrink-0 w-[80px]">{log.timestamp}</span>
            <Badge
              variant="secondary"
              className={`text-[9px] px-1 py-0 rounded-sm font-mono shrink-0 ${NODE_COLORS[log.node] ?? ''}`}
            >
              {log.node}
            </Badge>
            <span className={`${LEVEL_COLORS[log.level] ?? 'text-gray-400'} break-all`}>
              {log.message}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

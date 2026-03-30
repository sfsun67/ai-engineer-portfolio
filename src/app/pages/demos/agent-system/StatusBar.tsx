import { AnimatePresence, motion } from 'motion/react'

interface StatusBarProps {
  label: string
  isComplete: boolean
  isTyping: boolean
}

export function StatusBar({ label, isComplete, isTyping }: StatusBarProps) {
  const dotColor = isComplete
    ? 'bg-[#4DA65C]'
    : isTyping
      ? 'bg-[#F4D330] animate-pulse'
      : 'bg-[#1D79E4] animate-pulse'

  return (
    <div className="h-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center px-4 gap-2 shrink-0">
      <div className={`w-2 h-2 rounded-full ${dotColor} transition-colors duration-300`} />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-mono text-gray-600"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

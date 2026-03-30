import { useEffect } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/app/components/ui/resizable'
import { useTimeline } from './useTimeline'
import { FileExplorer } from './FileExplorer'
import { ChatPanel } from './ChatPanel'
import { LogPanel } from './LogPanel'

export function AgentSystemDemo() {
  const timeline = useTimeline()

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      timeline.start()
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex-1 min-h-0 rounded-lg overflow-hidden border-2 border-gray-200">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left: File Explorer */}
        <ResizablePanel defaultSize={20} minSize={12} maxSize={30}>
          <FileExplorer
            currentStep={timeline.currentStep}
            visibleFileIds={timeline.visibleFileIds}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center: Chat */}
        <ResizablePanel defaultSize={55} minSize={35}>
          <ChatPanel
            messages={timeline.messages}
            typingText={timeline.typingText}
            isTyping={timeline.isTyping}
            statusLabel={timeline.statusLabel}
            isComplete={timeline.isComplete}
            checkpoint={timeline.checkpoint}
            showFeedbackInput={timeline.showFeedbackInput}
            wrongChoice={timeline.wrongChoice}
            onCheckpointChoice={timeline.handleCheckpointChoice}
            onFeedbackSubmit={timeline.handleFeedbackSubmit}
            onRestart={timeline.restart}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Log Panel */}
        <ResizablePanel
          defaultSize={25}
          minSize={0}
          maxSize={40}
          collapsible
          collapsedSize={0}
        >
          <LogPanel logs={timeline.logs} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

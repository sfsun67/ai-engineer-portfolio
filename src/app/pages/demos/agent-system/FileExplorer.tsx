import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Film, Music, FileJson, FileText, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import type { FileNode, FileType } from './types'
import { FILE_TREE, getVisibleTree } from './file-tree'

// ── File icon by type ──────────────────────────────────────────

const FILE_ICONS: Record<FileType, typeof File> = {
  json: FileJson,
  text: FileText,
  video: Film,
  audio: Music,
}

function getFileIcon(node: FileNode) {
  if (node.type === 'folder') return null
  const Icon = (node.fileType && FILE_ICONS[node.fileType]) || File
  return Icon
}

// ── Video thumbnail placeholder ────────────────────────────────

function VideoPlaceholder({ name, size }: { name: string; size?: string }) {
  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <Film className="w-6 h-6 text-white/60" />
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/40">
          1920x1080
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-gray-500 text-xs">文件名</div>
          <div className="font-mono text-gray-300">{name}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">大小</div>
          <div className="font-mono text-gray-300">{size ?? '—'}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">类型</div>
          <div className="font-mono text-gray-300">video/mp4</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">编码</div>
          <div className="font-mono text-gray-300">H.264</div>
        </div>
      </div>
    </div>
  )
}

// ── Audio waveform placeholder ─────────────────────────────────

function AudioPlaceholder({ name, size }: { name: string; size?: string }) {
  // Generate mock waveform bars
  const bars = Array.from({ length: 40 }, (_, i) => {
    const h = 10 + Math.sin(i * 0.5) * 20 + Math.random() * 15
    return Math.max(4, Math.min(40, h))
  })

  return (
    <div className="space-y-3">
      <div className="w-full h-16 bg-gray-900 rounded-lg flex items-end justify-center gap-[2px] px-4 py-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1 bg-[#F48B29]/60 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-gray-500 text-xs">文件名</div>
          <div className="font-mono text-gray-300">{name}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">大小</div>
          <div className="font-mono text-gray-300">{size ?? '—'}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">类型</div>
          <div className="font-mono text-gray-300">audio/wav</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">采样率</div>
          <div className="font-mono text-gray-300">24000 Hz</div>
        </div>
      </div>
    </div>
  )
}

// ── File preview dialog content ────────────────────────────────

function FilePreviewContent({ node }: { node: FileNode }) {
  if (node.fileType === 'json' && node.mockContent) {
    const lines = node.mockContent.split('\n')
    const truncated = lines.length > 50
    const display = truncated ? lines.slice(0, 50).join('\n') : node.mockContent
    return (
      <div className="space-y-2">
        <pre className="bg-gray-950 text-gray-300 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[60vh] overflow-y-auto leading-relaxed">
          {display}
        </pre>
        {truncated && (
          <p className="text-xs text-gray-500 text-center">
            ... 共 {lines.length} 行
          </p>
        )}
      </div>
    )
  }

  if (node.fileType === 'text' && node.mockContent) {
    return (
      <pre className="bg-gray-50 text-gray-700 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[60vh] overflow-y-auto leading-relaxed whitespace-pre-wrap">
        {node.mockContent}
      </pre>
    )
  }

  if (node.fileType === 'video') {
    return <VideoPlaceholder name={node.name} size={node.mockSize} />
  }

  if (node.fileType === 'audio') {
    return <AudioPlaceholder name={node.name} size={node.mockSize} />
  }

  return (
    <div className="text-center text-gray-500 py-8">
      暂无预览
    </div>
  )
}

// ── Tree node component ────────────────────────────────────────

function TreeNode({
  node,
  depth,
  visibleFileIds,
  onFileClick,
}: {
  node: FileNode
  depth: number
  visibleFileIds: Set<string>
  onFileClick: (node: FileNode) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const isNew = visibleFileIds.has(node.id)

  if (node.type === 'folder') {
    const visibleChildren = node.children?.filter((c) => visibleFileIds.has(c.id)) ?? []
    if (visibleChildren.length === 0 && depth > 0) return null

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 w-full px-1 py-0.5 text-left hover:bg-gray-100 rounded text-sm group"
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
          {expanded
            ? <FolderOpen className="w-3.5 h-3.5 text-[#F4D330] shrink-0" />
            : <Folder className="w-3.5 h-3.5 text-[#F4D330] shrink-0" />}
          <span className="font-mono text-xs text-gray-700 truncate">{node.name}</span>
        </button>
        <AnimatePresence>
          {expanded && visibleChildren.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TreeNode
                node={child}
                depth={depth + 1}
                visibleFileIds={visibleFileIds}
                onFileClick={onFileClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // File node
  const Icon = getFileIcon(node)!
  const iconColor = node.fileType === 'json' ? 'text-[#F4D330]'
    : node.fileType === 'video' ? 'text-[#1D79E4]'
    : node.fileType === 'audio' ? 'text-[#F48B29]'
    : 'text-gray-400'

  return (
    <motion.button
      initial={isNew ? { opacity: 0, x: -8 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onFileClick(node)}
      className="flex items-center gap-1.5 w-full px-1 py-0.5 text-left hover:bg-gray-100 rounded text-sm group"
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <Icon className={`w-3.5 h-3.5 ${iconColor} shrink-0`} />
      <span className="font-mono text-xs text-gray-600 truncate group-hover:text-gray-900">
        {node.name}
      </span>
      {node.mockSize && (
        <span className="ml-auto text-[10px] text-gray-400 font-mono shrink-0">
          {node.mockSize}
        </span>
      )}
    </motion.button>
  )
}

// ── Main FileExplorer component ────────────────────────────────

interface FileExplorerProps {
  currentStep: number
  visibleFileIds: Set<string>
}

export function FileExplorer({ currentStep, visibleFileIds }: FileExplorerProps) {
  const [previewNode, setPreviewNode] = useState<FileNode | null>(null)
  const visibleTree = getVisibleTree(FILE_TREE, currentStep)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="h-10 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
        <Folder className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Explorer</span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {currentStep < 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            等待任务启动...
          </div>
        ) : (
          visibleTree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              visibleFileIds={visibleFileIds}
              onFileClick={setPreviewNode}
            />
          ))
        )}
      </div>

      {/* File preview dialog */}
      <Dialog open={!!previewNode} onOpenChange={(open) => !open && setPreviewNode(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="font-mono text-sm flex items-center gap-2">
            {previewNode && getFileIcon(previewNode) && (() => {
              const Icon = getFileIcon(previewNode)!
              return <Icon className="w-4 h-4" />
            })()}
            {previewNode?.name}
            {previewNode?.mockSize && (
              <span className="text-xs text-gray-400 font-normal">({previewNode.mockSize})</span>
            )}
          </DialogTitle>
          {previewNode && <FilePreviewContent node={previewNode} />}
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => {
                alert('Demo 环境暂不支持下载')
              }}
            >
              <Download className="w-3 h-3" />
              下载
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

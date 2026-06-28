import { ChevronDown, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chat-store'

export function ChatFloatingActions() {
  const pendingMessages = useChatStore((s) => s.pendingMessages)
  const isAtBottom = useChatStore((s) => s.isAtBottom)
  const hasNewerPages = useChatStore((s) => s.hasNewerPages)
  const clearPendingMessages = useChatStore((s) => s.clearPendingMessages)
  const goToRecentMessages = useChatStore((s) => s.goToRecentMessages)

  const hasPending = pendingMessages.length > 0
  // Show "Ir para mensagens recentes" when:
  // - anchored to a middle message (hasNewerPages = there are newer pages not loaded)
  // - OR scrolled up away from bottom (but no pending — pending gets its own label)
  const showGoToRecent = !isAtBottom || hasNewerPages

  if (!showGoToRecent && !hasPending) return null

  const handleClick = () => {
    clearPendingMessages()
    goToRecentMessages()
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center gap-2">
      {/* New messages badge */}
      {hasPending && (
        <Button
          onClick={handleClick}
          size="sm"
          variant="default"
          className="rounded-full shadow-lg gap-1.5 pl-3 pr-4"
        >
          <ChevronDown className="h-4 w-4" />
          <span className="text-xs">
            {pendingMessages.length} nova{pendingMessages.length > 1 ? 's' : ''} mensage{pendingMessages.length > 1 ? 'ns' : 'm'}
          </span>
        </Button>
      )}

      {/* Go to recent messages */}
      {showGoToRecent && !hasPending && (
        <Button
          onClick={handleClick}
          size="sm"
          variant="secondary"
          className="rounded-full shadow-lg gap-1.5 pl-3 pr-4 border border-border"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="text-xs">Ir para mensagens recentes</span>
        </Button>
      )}
    </div>
  )
}

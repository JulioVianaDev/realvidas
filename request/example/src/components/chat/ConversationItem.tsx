import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/chat'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatTime(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d`
}

const TAG_COLORS: Record<string, string> = {
  support: 'bg-blue-100 text-blue-800',
  sales: 'bg-green-100 text-green-800',
  billing: 'bg-yellow-100 text-yellow-800',
  technical: 'bg-purple-100 text-purple-800',
  general: 'bg-gray-100 text-gray-800',
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-border/50',
        isActive ? 'bg-accent' : 'hover:bg-muted/50',
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="text-xs font-medium">
          {getInitials(conversation.customerName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{conversation.customerName}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {conversation.lastMessage}
        </p>
        <div className="flex items-center justify-between mt-1">
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', TAG_COLORS[conversation.tag])}>
            {conversation.tag}
          </Badge>
          {conversation.unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

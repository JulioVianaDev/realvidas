import { CornerUpLeft, Play, Image, Mic, Video } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/chat'

interface MessageItemProps {
  message: Message
  onReplyClick?: (messageId: number) => void
}

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const SENDER_CONFIG = {
  customer: { label: 'Customer', bg: 'bg-muted', align: 'items-start' as const, avatar: 'bg-blue-500' },
  ai: { label: 'AI', bg: 'bg-primary/10', align: 'items-end' as const, avatar: 'bg-violet-500' },
  user: { label: 'Agent', bg: 'bg-green-50', align: 'items-end' as const, avatar: 'bg-green-500' },
}

export function MessageItem({ message, onReplyClick }: MessageItemProps) {
  const config = SENDER_CONFIG[message.sender]
  const isRight = message.sender !== 'customer'

  return (
    <div className={cn('flex flex-col gap-1 px-4', config.align)}>
      {/* Reply preview */}
      {message.replyToId != null && (
        <button
          onClick={() => onReplyClick?.(message.replyToId!)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded px-2 py-1 max-w-[280px] hover:bg-muted transition-colors cursor-pointer"
        >
          <CornerUpLeft className="h-3 w-3 shrink-0" />
          <span className="truncate">{message.replyToPreview}</span>
        </button>
      )}

      <div className={cn('flex gap-2 max-w-[75%]', isRight && 'flex-row-reverse')}>
        <Avatar className="h-7 w-7 shrink-0 mt-1">
          <AvatarFallback className={cn('text-white text-[10px]', config.avatar)}>
            {config.label[0]}
          </AvatarFallback>
        </Avatar>

        <div className={cn('rounded-lg px-3 py-2 text-sm', config.bg)}>
          {/* Text message */}
          {message.type === 'text' && <p className="whitespace-pre-wrap">{message.content}</p>}

          {/* Image message */}
          {message.type === 'image' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Image className="h-3 w-3" />
                <span>{message.content}</span>
              </div>
              <div className="rounded-md overflow-hidden bg-muted w-[240px] h-[180px] flex items-center justify-center">
                <img
                  src={message.mediaUrl}
                  alt="Shared"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Audio message */}
          {message.type === 'audio' && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs">{message.content}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1 bg-primary/30 rounded-full flex-1" />
                  <span className="text-[10px] text-muted-foreground">0:42</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Play className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Video message */}
          {message.type === 'video' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Video className="h-3 w-3" />
                <span>{message.content}</span>
              </div>
              <div className="rounded-md overflow-hidden bg-muted/80 w-[240px] h-[160px] flex items-center justify-center relative">
                <div className="h-12 w-12 rounded-full bg-black/40 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>
            </div>
          )}

          {/* Buttons message */}
          {message.type === 'buttons' && (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              <div className="flex flex-col gap-1">
                {message.buttons?.map((btn) => (
                  <Button key={btn.id} variant="outline" size="sm" className="justify-start text-xs h-7">
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <span className="text-[10px] text-muted-foreground mt-1 block">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}

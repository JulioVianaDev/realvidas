import { useState, useRef } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chat-store'

export function ChatInput() {
  const activeConversation = useChatStore((s) => s.activeConversation)
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  if (!activeConversation) return null

  const handleSend = () => {
    if (!message.trim()) return
    // In a real app, this would call an API to send the message
    // and invalidate the messages query
    console.log('Send message:', message, 'to:', activeConversation.id)
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleSend}
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

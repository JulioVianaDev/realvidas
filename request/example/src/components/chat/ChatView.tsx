import { useCallback } from 'react'
import { MessageSquare } from 'lucide-react'
import { useChatStore } from '@/store/chat-store'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { ChatFloatingActions } from './NewMessageIndicator'

export function ChatView() {
  const activeConversation = useChatStore((s) => s.activeConversation)
  const setScrollToMessageId = useChatStore((s) => s.setScrollToMessageId)

  const handleReplyClick = useCallback(
    (messageId: number) => {
      setScrollToMessageId(messageId)
    },
    [setScrollToMessageId],
  )

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 bg-muted/20">
        <MessageSquare className="h-12 w-12" />
        <div className="text-center">
          <p className="font-medium">No conversation selected</p>
          <p className="text-sm">Choose a conversation from the left panel to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <ChatHeader />
      <div className="flex-1 min-h-0 relative flex flex-col" style={{ height: '70vh' }}>
        <ChatMessages
          conversationId={activeConversation.id}
          onReplyClick={handleReplyClick}
        />
        <ChatFloatingActions />
      </div>
      <ChatInput />
    </div>
  )
}

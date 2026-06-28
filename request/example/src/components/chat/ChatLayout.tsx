import { ConversationSidebar } from './ConversationSidebar'
import { ChatView } from './ChatView'

export function ChatLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left panel - Conversations */}
      <div className="w-[360px] shrink-0 h-screen flex flex-col">
        <ConversationSidebar />
      </div>

      {/* Right panel - Chat */}
      <div className="flex-1 h-screen flex flex-col min-w-0">
        <ChatView />
      </div>
    </div>
  )
}

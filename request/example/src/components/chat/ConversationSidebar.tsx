import { ConversationFiltersBar } from './ConversationFilters'
import { ConversationList } from './ConversationList'

export function ConversationSidebar() {
  return (
    <div className="flex flex-col h-full border-r border-border bg-card">
      <div className="p-3 border-b border-border">
        <h2 className="font-semibold text-base">Conversations</h2>
      </div>
      <ConversationFiltersBar />
      <ConversationList />
    </div>
  )
}

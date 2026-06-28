import { useState } from 'react'
import { Search, X, Phone, MoreVertical } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/store/chat-store'
import { searchMessages } from '@/api/chat-api'
import type { Message } from '@/types/chat'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ChatHeader() {
  const activeConversation = useChatStore((s) => s.activeConversation)
  const setScrollToMessageId = useChatStore((s) => s.setScrollToMessageId)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)

  const { data: searchResults } = useQuery({
    queryKey: ['messageSearch', activeConversation?.id, searchQuery],
    queryFn: () => searchMessages(activeConversation!.id, searchQuery),
    enabled: !!activeConversation && searchQuery.length >= 2,
  })

  if (!activeConversation) return null

  const handleSearchResultClick = (message: Message) => {
    setScrollToMessageId(message.id)
  }

  const navigateResult = (direction: 'prev' | 'next') => {
    if (!searchResults?.length) return
    const newIndex =
      direction === 'next'
        ? (selectedResultIndex + 1) % searchResults.length
        : (selectedResultIndex - 1 + searchResults.length) % searchResults.length
    setSelectedResultIndex(newIndex)
    handleSearchResultClick(searchResults[newIndex])
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs font-medium">
              {getInitials(activeConversation.customerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{activeConversation.customerName}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {activeConversation.tag}
              </Badge>
              <Badge
                variant={activeConversation.status === 'active' ? 'default' : 'secondary'}
                className="text-[10px] px-1.5 py-0"
              >
                {activeConversation.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Last active {new Date(activeConversation.lastMessageAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen)
              if (isSearchOpen) {
                setSearchQuery('')
                setSelectedResultIndex(0)
              }
            }}
          >
            {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedResultIndex(0)
                }}
                className="pl-9 h-8 text-sm"
                autoFocus
              />
            </div>
            {searchResults && searchResults.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>
                  {selectedResultIndex + 1}/{searchResults.length}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigateResult('prev')}>
                  <span className="text-xs">^</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigateResult('next')}>
                  <span className="text-xs">v</span>
                </Button>
              </div>
            )}
          </div>

          {/* Search results dropdown */}
          {searchResults && searchResults.length > 0 && (
            <div className="max-h-48 overflow-auto rounded-md border border-border bg-popover">
              {searchResults.slice(0, 20).map((msg, idx) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedResultIndex(idx)
                    handleSearchResultClick(msg)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors border-b border-border/50 last:border-0 ${
                    idx === selectedResultIndex ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium capitalize text-muted-foreground">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs truncate mt-0.5">{msg.content}</p>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && searchResults?.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No messages found</p>
          )}
        </div>
      )}
    </div>
  )
}

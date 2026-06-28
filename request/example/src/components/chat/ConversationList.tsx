import { useRef, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fetchConversations } from '@/api/chat-api'
import { useChatStore } from '@/store/chat-store'
import { ConversationItem } from './ConversationItem'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 15

export function ConversationList() {
  const parentRef = useRef<HTMLDivElement>(null)
  const filters = useChatStore((s) => s.filters)
  const activeConversation = useChatStore((s) => s.activeConversation)
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['conversations', filters],
    queryFn: ({ pageParam }) => fetchConversations(pageParam, PAGE_SIZE, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

  const allConversations = data ? data.pages.flatMap((p) => p.items) : []
  const rowCount = hasNextPage ? allConversations.length + 1 : allConversations.length

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= allConversations.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, fetchNextPage, allConversations.length])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoader = virtualRow.index > allConversations.length - 1

          if (isLoader) {
            return (
              <div
                key="loader"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex items-center justify-center text-sm text-muted-foreground"
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load more'}
              </div>
            )
          }

          const conversation = allConversations[virtualRow.index]
          return (
            <div
              key={conversation.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ConversationItem
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => setActiveConversation(conversation)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

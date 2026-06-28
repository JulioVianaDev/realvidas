import { useRef, useEffect, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fetchMessages } from '@/api/chat-api'
import { useChatStore } from '@/store/chat-store'
import { MessageItem } from './MessageItem'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import type { Message } from '@/types/chat'

const PAGE_SIZE = 10
const SCROLL_THRESHOLD = 50

interface ChatMessagesProps {
  conversationId: string
  onReplyClick: (messageId: number) => void
}

export function ChatMessages({ conversationId, onReplyClick }: ChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const didInitialScroll = useRef(false)
  const pendingGoToRecent = useRef(false)
  const prevScrollHeightRef = useRef(0)
  const prevScrollTopRef = useRef(0)

  const scrollToMessageId = useChatStore((s) => s.scrollToMessageId)
  const setScrollToMessageId = useChatStore((s) => s.setScrollToMessageId)
  const anchorMessageId = useChatStore((s) => s.anchorMessageId)
  const setAnchorMessageId = useChatStore((s) => s.setAnchorMessageId)
  const setHasNewerPages = useChatStore((s) => s.setHasNewerPages)
  const setIsAtBottom = useChatStore((s) => s.setIsAtBottom)
  const addPendingMessage = useChatStore((s) => s.addPendingMessage)
  const isAtBottom = useChatStore((s) => s.isAtBottom)
  const goToRecentCounter = useChatStore((s) => s.goToRecentCounter)

  // When scrollToMessageId changes externally (search/reply), set anchor
  useEffect(() => {
    if (scrollToMessageId != null) {
      setAnchorMessageId(scrollToMessageId)
      didInitialScroll.current = false
    }
  }, [scrollToMessageId, setAnchorMessageId])

  // Reset when conversation changes
  useEffect(() => {
    setAnchorMessageId(null)
    setHasNewerPages(false)
    didInitialScroll.current = false
  }, [conversationId, setAnchorMessageId, setHasNewerPages])

  const {
    data,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['messages', conversationId, anchorMessageId],
    queryFn: ({ pageParam }) => {
      if (pageParam.direction === 'around') {
        return fetchMessages(conversationId, { aroundMessageId: pageParam.cursor, limit: PAGE_SIZE })
      }
      if (pageParam.direction === 'older') {
        return fetchMessages(conversationId, { messageIdBefore: pageParam.cursor, limit: PAGE_SIZE })
      }
      return fetchMessages(conversationId, { messageIdAfter: pageParam.cursor, limit: PAGE_SIZE })
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor == null) return undefined
      return { direction: 'newer' as const, cursor: lastPage.nextCursor }
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.prevCursor == null) return undefined
      return { direction: 'older' as const, cursor: firstPage.prevCursor }
    },
    initialPageParam: anchorMessageId
      ? { direction: 'around' as const, cursor: anchorMessageId }
      : { direction: 'around' as const, cursor: undefined as number | undefined },
  })

  // Sync hasNextPage to store so floating button knows
  useEffect(() => {
    setHasNewerPages(!!hasNextPage)
  }, [hasNextPage, setHasNewerPages])

  // Flatten all messages, deduplicating by id and sorting
  const allMessages: Message[] = []
  const seenIds = new Set<number>()
  if (data) {
    for (const page of data.pages) {
      for (const msg of page.items) {
        if (!seenIds.has(msg.id)) {
          seenIds.add(msg.id)
          allMessages.push(msg)
        }
      }
    }
  }
  allMessages.sort((a, b) => a.id - b.id)

  const virtualizer = useVirtualizer({
    count: allMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const msg = allMessages[index]
      if (!msg) return 72
      if (msg.type === 'image') return 220
      if (msg.type === 'video') return 200
      if (msg.type === 'audio') return 72
      if (msg.type === 'buttons') return 120
      if (msg.replyToId != null) return 100
      return 72
    },
    overscan: 5,
    getItemKey: (index) => allMessages[index]?.id ?? index,
  })

  // Scroll-position-based fetch triggers
  const handleScroll = useCallback(() => {
    const el = parentRef.current
    if (!el) return

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setIsAtBottom(atBottom)

    if (el.scrollTop < SCROLL_THRESHOLD && hasPreviousPage && !isFetchingPreviousPage) {
      // Capture scroll state BEFORE the fetch (and its loading indicator)
      // so the restoration calculation isn't skewed by the indicator height.
      prevScrollHeightRef.current = el.scrollHeight
      prevScrollTopRef.current = el.scrollTop
      fetchPreviousPage()
    }

    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    setIsAtBottom,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ])

  // Scroll to target message after data loads (search / reply)
  useEffect(() => {
    if (scrollToMessageId == null || allMessages.length === 0) return
    const msgIndex = allMessages.findIndex((m) => m.id === scrollToMessageId)
    if (msgIndex !== -1) {
      virtualizer.scrollToIndex(msgIndex, { align: 'center' })
      const timer = setTimeout(() => setScrollToMessageId(null), 600)
      return () => clearTimeout(timer)
    }
  }, [scrollToMessageId, allMessages, virtualizer, setScrollToMessageId])

  // Auto-scroll to bottom on initial load (when no anchor)
  useEffect(() => {
    if (anchorMessageId != null) return
    if (allMessages.length > 0 && !isLoading && !didInitialScroll.current) {
      didInitialScroll.current = true
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(allMessages.length - 1, { align: 'end' })
      })
    }
  }, [anchorMessageId, allMessages.length, isLoading, virtualizer])

  // "Go to recent" clicked — use a pending flag so we scroll to bottom
  // once data is ready, without resetting didInitialScroll (which would
  // cause the initial-scroll effect to re-fire on any later allMessages
  // change, e.g. fetchPreviousPage, snapping the user back to the bottom).
  useEffect(() => {
    if (goToRecentCounter === 0) return // skip mount
    pendingGoToRecent.current = true
    // Clear stale scroll-restoration refs so they don't corrupt the
    // next fetchPreviousPage cycle after a context change.
    prevScrollHeightRef.current = 0
    prevScrollTopRef.current = 0
  }, [goToRecentCounter])

  useEffect(() => {
    if (!pendingGoToRecent.current) return
    if (allMessages.length > 0 && !isLoading) {
      pendingGoToRecent.current = false
      requestAnimationFrame(() => {
        virtualizer.scrollToIndex(allMessages.length - 1, { align: 'end' })
        setIsAtBottom(true)
      })
    }
  }, [goToRecentCounter, allMessages.length, isLoading, virtualizer, setIsAtBottom])

  // Maintain scroll position when older messages prepend.
  // Values are captured in handleScroll right before fetchPreviousPage().
  useEffect(() => {
    const el = parentRef.current
    if (!el || prevScrollHeightRef.current === 0) return
    const heightDiff = el.scrollHeight - prevScrollHeightRef.current
    if (heightDiff > 0) {
      el.scrollTop = prevScrollTopRef.current + heightDiff
      prevScrollHeightRef.current = 0
    }
  }, [allMessages.length])

  // Simulate receiving new messages periodically
  useEffect(() => {
    if (!conversationId) return
    const interval = setInterval(() => {
      if (!isAtBottom) {
        const newMsg: Message = {
          id: Date.now(),
          conversationId,
          sender: 'customer',
          type: 'text',
          content: 'New message from customer! This just arrived.',
          timestamp: new Date().toISOString(),
          read: false,
        }
        addPendingMessage(newMsg)
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [conversationId, isAtBottom, addPendingMessage])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4 flex-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'justify-end'}`}>
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <Skeleton className="h-16 w-48 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="flex-1 overflow-auto"
    >
      {isFetchingPreviousPage && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading older messages...
        </div>
      )}

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const message = allMessages[virtualRow.index]
          if (!message) return null

          return (
            <div
              key={message.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={`py-1.5 ${scrollToMessageId === message.id ? 'animate-pulse bg-accent/50 rounded' : ''}`}
            >
              <MessageItem message={message} onReplyClick={onReplyClick} />
            </div>
          )
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading newer messages...
        </div>
      )}
    </div>
  )
}

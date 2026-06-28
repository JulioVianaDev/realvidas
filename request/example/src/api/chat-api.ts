import type {
  ConversationFilters,
  ConversationsPage,
  MessagesPage,
  Message,
} from '@/types/chat'
import { ALL_CONVERSATIONS, getMessagesForConversation } from './mock-data'

const DELAY = 300

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchConversations(
  cursor: number,
  limit: number,
  filters: ConversationFilters,
): Promise<ConversationsPage> {
  await delay(DELAY)

  let filtered = [...ALL_CONVERSATIONS]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    )
  }

  if (filters.tag !== 'all') {
    filtered = filtered.filter((c) => c.tag === filters.tag)
  }

  switch (filters.orderBy) {
    case 'recent':
      filtered.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime())
      break
    case 'unread':
      filtered.sort((a, b) => b.unreadCount - a.unreadCount)
      break
  }

  const start = cursor
  const items = filtered.slice(start, start + limit)
  const nextCursor = start + limit < filtered.length ? start + limit : null

  return { items, nextCursor }
}

/**
 * Fetch messages using cursor-based pagination by message ID.
 * - messageIdBefore: get messages with id < this value (scrolling up / older)
 * - messageIdAfter: get messages with id > this value (scrolling down / newer)
 * - aroundMessageId: center results around this message id
 */
export async function fetchMessages(
  conversationId: string,
  params: {
    messageIdBefore?: number
    messageIdAfter?: number
    aroundMessageId?: number
    limit?: number
  },
): Promise<MessagesPage> {
  await delay(DELAY)

  const allMessages = getMessagesForConversation(conversationId)
  const limit = params.limit ?? 10

  if (params.aroundMessageId != null) {
    const targetIdx = allMessages.findIndex((m) => m.id === params.aroundMessageId)
    if (targetIdx === -1) {
      return { items: [], nextCursor: null, prevCursor: null }
    }
    const halfLimit = Math.floor(limit / 2)
    const start = Math.max(0, targetIdx - halfLimit)
    const end = Math.min(allMessages.length, start + limit)
    const items = allMessages.slice(start, end)
    const prevCursor = start > 0 ? items[0].id : null
    const nextCursor = end < allMessages.length ? items[items.length - 1].id : null
    return { items, prevCursor, nextCursor }
  }

  if (params.messageIdBefore != null) {
    const idx = allMessages.findIndex((m) => m.id === params.messageIdBefore)
    if (idx <= 0) {
      return { items: [], nextCursor: null, prevCursor: null }
    }
    const start = Math.max(0, idx - limit)
    const items = allMessages.slice(start, idx)
    const prevCursor = start > 0 ? items[0].id : null
    const nextCursor = params.messageIdBefore
    return { items, prevCursor, nextCursor }
  }

  if (params.messageIdAfter != null) {
    const idx = allMessages.findIndex((m) => m.id === params.messageIdAfter)
    if (idx === -1 || idx >= allMessages.length - 1) {
      return { items: [], nextCursor: null, prevCursor: null }
    }
    const start = idx + 1
    const end = Math.min(allMessages.length, start + limit)
    const items = allMessages.slice(start, end)
    const prevCursor = params.messageIdAfter
    const nextCursor = end < allMessages.length ? items[items.length - 1].id : null
    return { items, prevCursor, nextCursor }
  }

  // Default: get the latest messages (end of conversation)
  const start = Math.max(0, allMessages.length - limit)
  const items = allMessages.slice(start)
  const prevCursor = start > 0 ? items[0].id : null
  return { items, prevCursor, nextCursor: null }
}

export async function searchMessages(
  conversationId: string,
  query: string,
): Promise<Message[]> {
  await delay(DELAY)
  const allMessages = getMessagesForConversation(conversationId)
  const q = query.toLowerCase()
  return allMessages.filter((m) => m.content.toLowerCase().includes(q))
}

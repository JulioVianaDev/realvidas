export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'buttons'

export type MessageSender = 'customer' | 'ai' | 'user'

export interface MessageButton {
  id: string
  label: string
  value: string
}

export interface Message {
  id: number
  conversationId: string
  sender: MessageSender
  type: MessageType
  content: string
  mediaUrl?: string
  buttons?: MessageButton[]
  replyToId?: number
  replyToPreview?: string
  timestamp: string
  read: boolean
}

export type ConversationTag = 'support' | 'sales' | 'billing' | 'technical' | 'general'

export type ConversationStatus = 'active' | 'closed' | 'pending'

export interface Conversation {
  id: string
  customerName: string
  customerAvatar?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  tag: ConversationTag
  status: ConversationStatus
}

export type ConversationOrderBy = 'recent' | 'oldest' | 'unread'

export interface ConversationFilters {
  search: string
  tag: ConversationTag | 'all'
  orderBy: ConversationOrderBy
}

export interface ConversationsPage {
  items: Conversation[]
  nextCursor: number | null
}

export interface MessagesPage {
  items: Message[]
  nextCursor: number | null
  prevCursor: number | null
}

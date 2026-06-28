import { create } from 'zustand'
import type { Conversation, ConversationFilters, Message } from '@/types/chat'

interface ChatState {
  // Active conversation
  activeConversation: Conversation | null
  setActiveConversation: (conversation: Conversation | null) => void

  // Conversation filters
  filters: ConversationFilters
  setFilters: (filters: Partial<ConversationFilters>) => void

  // Message to scroll to (from search or reply click)
  scrollToMessageId: number | null
  setScrollToMessageId: (id: number | null) => void

  // Anchor message ID — controls which page the query loads around.
  // null = load from the end (recent messages)
  anchorMessageId: number | null
  setAnchorMessageId: (id: number | null) => void

  // Whether the infinite query still has newer pages to load
  // (true when anchored to a middle message and haven't scrolled to the end yet)
  hasNewerPages: boolean
  setHasNewerPages: (value: boolean) => void

  // New messages received while scrolled up
  pendingMessages: Message[]
  addPendingMessage: (message: Message) => void
  clearPendingMessages: () => void

  // Whether user is at the bottom of chat
  isAtBottom: boolean
  setIsAtBottom: (value: boolean) => void

  // Incremented each time user clicks "go to recent" — ChatMessages watches this
  // to scroll to bottom even when the query key hasn't changed
  goToRecentCounter: number

  // Go to recent: resets anchor + scrollToMessageId, signals ChatMessages to reload from end
  goToRecentMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  setActiveConversation: (conversation) =>
    set({
      activeConversation: conversation,
      pendingMessages: [],
      scrollToMessageId: null,
      anchorMessageId: null,
      hasNewerPages: false,
    }),

  filters: { search: '', tag: 'all', orderBy: 'recent' },
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),

  scrollToMessageId: null,
  setScrollToMessageId: (id) => set({ scrollToMessageId: id }),

  anchorMessageId: null,
  setAnchorMessageId: (id) => set({ anchorMessageId: id }),

  hasNewerPages: false,
  setHasNewerPages: (value) => set({ hasNewerPages: value }),

  pendingMessages: [],
  addPendingMessage: (message) =>
    set((state) => ({ pendingMessages: [...state.pendingMessages, message] })),
  clearPendingMessages: () => set({ pendingMessages: [] }),

  isAtBottom: true,
  setIsAtBottom: (value) => set({ isAtBottom: value }),

  goToRecentCounter: 0,

  goToRecentMessages: () =>
    set((state) => ({
      anchorMessageId: null,
      scrollToMessageId: null,
      pendingMessages: [],
      hasNewerPages: false,
      goToRecentCounter: state.goToRecentCounter + 1,
    })),
}))

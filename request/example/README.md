# Virtualized Chat Application

A high-performance chat application built with **React 19**, **TanStack Virtual**, **TanStack Query (Infinite Query)**, **Zustand**, and **shadcn/ui**. The entire UI is virtualized and paginated — no full dataset is ever held in memory at once.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Tech Stack and Why Each Library](#tech-stack-and-why-each-library)
- [Data Layer](#data-layer)
  - [Types](#types)
  - [Mock API](#mock-api)
  - [Cursor-Based Pagination — How and Why](#cursor-based-pagination--how-and-why)
- [State Management](#state-management)
  - [Every Field Explained](#every-field-explained)
  - [The goToRecentCounter Pattern](#the-gotorecentcounter-pattern)
- [Left Panel — Conversation Sidebar](#left-panel--conversation-sidebar)
  - [ConversationFilters](#conversationfilters)
  - [ConversationList — Virtualized Infinite Scroll](#conversationlist--virtualized-infinite-scroll)
  - [ConversationItem](#conversationitem)
- [Right Panel — Chat View](#right-panel--chat-view)
  - [ChatHeader — Info + Message Search](#chatheader--info--message-search)
  - [ChatMessages — Bidirectional Virtualized Infinite Scroll](#chatmessages--bidirectional-virtualized-infinite-scroll)
  - [MessageItem — 6 Message Types](#messageitem--6-message-types)
  - [ChatInput](#chatinput)
  - [ChatFloatingActions — "Ir para mensagens recentes"](#chatfloatingactions--ir-para-mensagens-recentes)
- [Critical Mechanisms](#critical-mechanisms)
  - [1. Scroll-Position-Based Loading (NOT Virtual Index)](#1-scroll-position-based-loading-not-virtual-index)
  - [2. Message Search → Anchor → Reload Around Message](#2-message-search--anchor--reload-around-message)
  - [3. Reply Click → Scroll to Original Message](#3-reply-click--scroll-to-original-message)
  - [4. New Message Indicator While Scrolled Up](#4-new-message-indicator-while-scrolled-up)
  - [5. "Ir para mensagens recentes" — Two Cases](#5-ir-para-mensagens-recentes--two-cases)
  - [6. Scroll Position Preservation on Prepend](#6-scroll-position-preservation-on-prepend)
  - [7. Initial Auto-Scroll to Bottom](#7-initial-auto-scroll-to-bottom)
- [Bugs That Were Fixed and Why](#bugs-that-were-fixed-and-why)
- [How to Replace Mock API with Real Backend](#how-to-replace-mock-api-with-real-backend)

---

## Architecture Overview

```
+------------------------------------------------------------------+
|                        App.tsx                                    |
|  QueryClientProvider + TooltipProvider                            |
|  +--------------------+--------------------------------------+   |
|  |   Left (360px)     |         Right (flex-1)               |   |
|  |                    |                                      |   |
|  |  +--------------+  |  +--------------------------------+  |   |
|  |  |   Header     |  |  |         ChatHeader             |  |   |
|  |  |"Conversations"|  |  |  avatar + name + tag + status  |  |   |
|  |  +--------------+  |  |  search messages toggle        |  |   |
|  |  +--------------+  |  +--------------------------------+  |   |
|  |  |  Filters     |  |  +--------------------------------+  |   |
|  |  |  search      |  |  |      ChatMessages (70vh)       |  |   |
|  |  |  tags        |  |  |  useInfiniteQuery + useVirtual |  |   |
|  |  |  ordering    |  |  |  bidirectional scroll          |  |   |
|  |  +--------------+  |  |  +----------------------------+|  |   |
|  |  +--------------+  |  |  | ChatFloatingActions        ||  |   |
|  |  |Conversation  |  |  |  | "Ir para msgs recentes"    ||  |   |
|  |  |   List       |  |  |  | "N novas mensagens"        ||  |   |
|  |  | useInfinite  |  |  |  +----------------------------+|  |   |
|  |  | Query +      |  |  +--------------------------------+  |   |
|  |  | useVirtual   |  |  +--------------------------------+  |   |
|  |  |              |  |  |         ChatInput              |  |   |
|  |  | scroll down  |  |  |  textarea + send button        |  |   |
|  |  | = load more  |  |  +--------------------------------+  |   |
|  |  +--------------+  |                                      |   |
|  +--------------------+--------------------------------------+   |
+------------------------------------------------------------------+
```

**Data flow:**
- **Zustand** handles cross-component UI state (active conversation, filters, scroll targets, floating button visibility).
- **TanStack Query** handles all server state (conversations list, messages, search results). Each has its own cache and pagination state.
- **TanStack Virtual** renders only visible DOM rows. The virtualizer knows the count of items from Query but only renders ~15-20 DOM nodes regardless of total data size.

---

## File Structure

```
src/
├── api/
│   ├── chat-api.ts          # API functions (fetchConversations, fetchMessages, searchMessages)
│   └── mock-data.ts         # Seeded random data generator (200 conversations, 80-200 msgs each)
├── components/
│   ├── chat/
│   │   ├── ChatLayout.tsx        # Main split layout (left 360px + right flex-1)
│   │   ├── ConversationSidebar.tsx  # Left panel container
│   │   ├── ConversationFilters.tsx  # Search + tag badges + order dropdown
│   │   ├── ConversationList.tsx     # Virtualized + infinite scroll conversation list
│   │   ├── ConversationItem.tsx     # Single conversation card UI
│   │   ├── ChatView.tsx            # Right panel container + empty state
│   │   ├── ChatHeader.tsx          # Customer info + message search
│   │   ├── ChatMessages.tsx        # Bidirectional virtualized infinite scroll messages
│   │   ├── MessageItem.tsx         # Renders 6 message types + reply preview
│   │   ├── ChatInput.tsx           # Auto-growing textarea + send
│   │   └── NewMessageIndicator.tsx # Floating "go to recent" / "new messages" button
│   └── ui/                   # shadcn components (button, input, badge, avatar, etc.)
├── store/
│   └── chat-store.ts         # Zustand store — all shared UI state
├── types/
│   └── chat.ts               # TypeScript types for everything
├── lib/
│   └── utils.ts              # cn() utility for className merging
├── App.tsx                    # Root: QueryClientProvider + TooltipProvider + ChatLayout
├── main.tsx                   # React DOM entry point
└── index.css                  # Tailwind + shadcn theme variables
```

---

## Tech Stack and Why Each Library

| Library | Version | Why |
|---------|---------|-----|
| **React 19** | ^19.2.0 | Latest React with concurrent features |
| **TanStack Virtual** | ^3.14.0 | Renders only visible rows in the DOM. Without this, rendering 200+ messages or conversations would create hundreds of DOM nodes, causing lag. The virtualizer creates ~15-20 DOM nodes and repositions them via CSS `transform: translateY()` as the user scrolls |
| **TanStack Query** | ^5.80.7 | Manages server state with built-in caching, deduplication, and `useInfiniteQuery` for paginated data. Avoids manual `useState` + `useEffect` fetch patterns. The `queryKey` system automatically refetches when parameters change |
| **Zustand** | ^5.0.11 | Lightweight global state for UI coordination between sibling components (e.g., ConversationList sets `activeConversation`, ChatView reads it). Chosen over React Context to avoid unnecessary re-renders — Zustand selectors only trigger re-render when the selected slice changes |
| **shadcn/ui** | ^4.10.0 | Pre-built accessible components (Button, Input, Badge, Avatar, Dialog, etc.) styled with Tailwind CSS variables. Not a dependency — components are copied into `src/components/ui/` and can be freely modified |
| **Tailwind CSS** | ^4.3.0 | Utility-first CSS. All styling is done via className strings, no separate CSS files needed for component styles |
| **Lucide React** | ^1.17.0 | Icon library used by shadcn. Provides `Search`, `Send`, `ChevronDown`, `Loader2`, etc. |
| **Vite** | rolldown-vite 7.2.5 | Build tool. Fast dev server with HMR. Path alias `@` maps to `./src` configured in `vite.config.ts` |

**Why NOT useMemo:** The project intentionally avoids `useMemo` per the design requirement. Instead:
- TanStack Query caches server data automatically (no need to memoize fetch results)
- Zustand selectors prevent unnecessary re-renders (no need to memoize derived state)
- TanStack Virtual handles its own internal memoization of visible item calculations

---

## Data Layer

### Types

**`src/types/chat.ts`**

```typescript
Message {
  id: number              // Unique, sequential. Used as cursor for pagination (id > X, id < X)
  conversationId: string
  sender: 'customer' | 'ai' | 'user'   // 3 actors in the chat
  type: 'text' | 'image' | 'audio' | 'video' | 'buttons'  // 6 render variants
  content: string         // Text content or description ("Shared an image")
  mediaUrl?: string       // URL for image/audio/video
  buttons?: MessageButton[]  // For type='buttons' — interactive option buttons
  replyToId?: number      // If this message replies to another, that message's ID
  replyToPreview?: string // First 60 chars of the original message (avoids extra fetch)
  timestamp: string       // ISO date string
  read: boolean
}

Conversation {
  id: string              // "conv-1", "conv-2", etc.
  customerName: string
  lastMessage: string     // Preview text for the sidebar
  lastMessageAt: string   // ISO date — used for ordering
  unreadCount: number     // Badge number
  tag: 'support' | 'sales' | 'billing' | 'technical' | 'general'
  status: 'active' | 'closed' | 'pending'
}
```

**Why `id` is a number for messages:** Cursor-based pagination uses `message.id > cursor` and `message.id < cursor` to fetch pages. Sequential numeric IDs make this simple and efficient. In a real DB this would be the primary key.

### Mock API

**`src/api/chat-api.ts`** — Three functions:

#### `fetchConversations(cursor, limit, filters)`
- **Pagination:** Offset-based (cursor = start index). Returns `nextCursor` if more items exist.
- **Filtering:** Applies search (name or last message), tag filter, and ordering (recent/oldest/unread) before slicing.
- **Why offset for conversations:** Conversations are a flat list sorted by a field. Offset pagination is simple and works fine. Messages use cursor-based because they need bidirectional loading.

#### `fetchMessages(conversationId, params)`
- **Three modes:**
  1. `aroundMessageId` — Loads `limit` messages centered around a specific message. Used for initial load (from end) and for search/reply navigation. Returns both `prevCursor` and `nextCursor`.
  2. `messageIdBefore` — Loads `limit` messages with `id < X`. Used when scrolling up (loading older). Returns items + `prevCursor` (if there are even older messages) + `nextCursor` (the ID we searched before).
  3. `messageIdAfter` — Loads `limit` messages with `id > X`. Used when scrolling down from an anchored position (loading newer).
  4. **Default** (no params) — Loads the last `limit` messages. Used when opening a conversation fresh.

- **Why cursor-based for messages:** In a real chat, messages are constantly being added. Offset pagination (`OFFSET 50 LIMIT 10`) would shift when new messages arrive, causing duplicates or gaps. Cursor-based (`WHERE id > 42 LIMIT 10`) is stable because it references a fixed point.

#### `searchMessages(conversationId, query)`
- Full-text search across all messages in a conversation. Returns matching `Message[]`.
- The searched message may NOT be in the currently loaded chat window — that's why clicking a result triggers an anchor change (see [mechanism #2](#2-message-search--anchor--reload-around-message)).

---

### Cursor-Based Pagination — How and Why

This is the most important architectural decision. Here's how it works for messages:

```
All messages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, ..., 150]

Initial load (from end): messages 141-150, prevCursor=141, nextCursor=null
  User sees messages 141-150 at the bottom

Scroll up -> fetchMessages({ messageIdBefore: 141, limit: 10 })
  Returns messages 131-140, prevCursor=131, nextCursor=141
  Now user sees 131-150

Search result clicks on message 45 -> fetchMessages({ aroundMessageId: 45, limit: 10 })
  Returns messages 40-49, prevCursor=40, nextCursor=49
  Chat reloads showing 40-49 centered on 45
  Scroll up from there loads 30-39
  Scroll down from there loads 50-59
```

**The TanStack Query side:**

```typescript
useInfiniteQuery({
  queryKey: ['messages', conversationId, anchorMessageId],
  //                                      ^ changes = full refetch
  getNextPageParam: (lastPage) => lastPage.nextCursor
    ? { direction: 'newer', cursor }
    : undefined,
  getPreviousPageParam: (firstPage) => firstPage.prevCursor
    ? { direction: 'older', cursor }
    : undefined,
  initialPageParam: anchorMessageId
    ? { direction: 'around', cursor: anchorMessageId }  // Search/reply: load around this ID
    : { direction: 'around', cursor: undefined },        // Normal: load from the end
})
```

When `anchorMessageId` changes (search, reply click), the `queryKey` changes and TanStack Query discards old cache and fetches fresh from the new anchor point. This is how we "teleport" to any message in the conversation.

---

## State Management

### Every Field Explained

**`src/store/chat-store.ts`** — Single Zustand store:

| Field | Type | Purpose | Set by | Read by |
|-------|------|---------|--------|---------|
| `activeConversation` | `Conversation or null` | Which conversation is open in the right panel | `ConversationList` (on click) | `ChatView`, `ChatHeader`, `ChatMessages`, `ChatInput` |
| `filters` | `ConversationFilters` | Search text, tag filter, ordering for conversation list | `ConversationFilters` component | `ConversationList` (as queryKey) |
| `scrollToMessageId` | `number or null` | Message to scroll to + highlight. Set by search result click or reply click | `ChatHeader` (search), `ChatView` (reply) | `ChatMessages` (scroll effect + highlight class) |
| `anchorMessageId` | `number or null` | Controls which page the messages query loads around. `null` = load from end (recent). A number = load centered on that message ID | `ChatMessages` (syncs from scrollToMessageId), `goToRecentMessages` (resets to null) | `ChatMessages` (in queryKey) |
| `hasNewerPages` | `boolean` | Whether the messages query has `hasNextPage=true`. Synced from query state | `ChatMessages` (useEffect syncs from query) | `ChatFloatingActions` (shows "Ir para mensagens recentes" when true) |
| `pendingMessages` | `Message[]` | New messages that arrived while user was scrolled up. Simulated with a 15s interval | `ChatMessages` (interval) | `ChatFloatingActions` (shows "N novas mensagens") |
| `isAtBottom` | `boolean` | Whether the chat scroll container is within 80px of the bottom | `ChatMessages` (onScroll handler) | `ChatFloatingActions` (decides visibility) |
| `goToRecentCounter` | `number` | Incremented each time user clicks "Ir para mensagens recentes". ChatMessages watches this to force scroll to bottom | `goToRecentMessages` action | `ChatMessages` (useEffect) |

### The goToRecentCounter Pattern

**Problem it solves:** When the user scrolls up in a normal chat (no search), `anchorMessageId` is already `null`. Clicking "go to recent" calls `goToRecentMessages()` which sets anchor to `null` — but it's already `null`, so the query key doesn't change, no refetch happens, and `didInitialScroll.current` is already `true` from the first load. Nothing would happen.

**Solution:** `goToRecentCounter` is a number that increments on each click. ChatMessages has a `useEffect` watching it:

```typescript
useEffect(() => {
  if (goToRecentCounter === 0) return // skip mount
  if (allMessages.length > 0) {
    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(allMessages.length - 1, { align: 'end' })
      setIsAtBottom(true)  // hide the button immediately
    })
  }
  didInitialScroll.current = false  // allow re-fire if refetch also happens
}, [goToRecentCounter])
```

This handles both cases:
1. **Anchor was null** (just scrolled up): scrolls virtualizer to last item. No refetch needed, data is already there.
2. **Anchor was set** (from search/reply): anchor resets to null, query key changes, refetch happens. After data arrives, the initial-load effect fires (because `didInitialScroll` was reset) and scrolls to bottom.

---

## Left Panel — Conversation Sidebar

### ConversationFilters

**`src/components/chat/ConversationFilters.tsx`**

- **Search input** — Types into `filters.search` in the Zustand store. The `ConversationList` query key includes `filters`, so typing triggers a refetch (TanStack Query deduplicates rapid changes).
- **Tag badges** — Clickable badges for each tag. Active tag has `variant="default"` (filled), others have `variant="outline"`. Clicking sets `filters.tag`.
- **Order dropdown** — shadcn `DropdownMenu` with three options: Most Recent, Oldest First, Most Unread. Sets `filters.orderBy`.

### ConversationList — Virtualized Infinite Scroll

**`src/components/chat/ConversationList.tsx`**

This combines `useInfiniteQuery` + `useVirtualizer` for the conversation sidebar.

```
useInfiniteQuery                    useVirtualizer
+---------------------+            +---------------------+
| queryKey: ['convs',  |            | count: allConvs.len |
|   filters]           |            |   + (hasNext ? 1:0) |
| pageParam: offset    |--pages-->  | estimateSize: 88px  |
| limit: 15            |  flatten   | overscan: 5         |
| getNextPageParam:    |            |                     |
|   nextCursor         |            | Only renders ~8-10  |
+---------------------+            | DOM nodes           |
                                   +---------------------+
```

**Loading trigger:** Uses a `useEffect` that checks if the last virtual item's index is past the data array. This works fine here because conversations only load forward (scroll down = more conversations). The cascade problem from messages doesn't apply because there's no bidirectional loading.

**Why 15 per page:** Enough to fill the visible area (360px wide, ~88px per item = ~5-6 visible) plus overscan, without over-fetching.

### ConversationItem

**`src/components/chat/ConversationItem.tsx`**

Pure presentational component. Shows:
- Avatar with initials (first letter of first + last name)
- Customer name + relative time ("3m", "2h", "5d")
- Last message preview (truncated)
- Tag badge with color coding per tag type
- Unread count badge (rounded pill)
- Active state highlight (bg-accent when selected)

---

## Right Panel — Chat View

### ChatHeader — Info + Message Search

**`src/components/chat/ChatHeader.tsx`**

Two sections:

**1. Info bar** — Avatar, name, tag badge, status badge, last active time. Always visible.

**2. Search bar** — Toggled by the search icon button. Contains:
- Search input — Uses `useQuery` (not infinite) to search all messages via `searchMessages()`. Enabled only when query has 2+ chars.
- Result counter — "3/15" with up/down navigation arrows.
- Results dropdown — Max 20 results shown. Each shows sender, time, and content preview. Clicking a result calls `setScrollToMessageId(message.id)`.

**How search to message navigation works:**
```
User clicks search result (message id=45)
  -> setScrollToMessageId(45)           <- store
  -> ChatMessages effect: setAnchorMessageId(45)  <- store
  -> queryKey: ['messages', 'conv-1', 45]  <- changed!
  -> TanStack Query: cache miss, fetch aroundMessageId=45
  -> API: returns messages 40-49 centered on 45
  -> Dedup + sort -> allMessages = [40,41,42,43,44,45,46,47,48,49]
  -> Virtualizer re-renders with new data
  -> Scroll effect: find index of id=45 -> scrollToIndex(5, center)
  -> Highlight: className includes animate-pulse for 600ms
  -> After 600ms: setScrollToMessageId(null) -> highlight removed
  -> User can now scroll up (loads 30-39) or down (loads 50-59)
```

### ChatMessages — Bidirectional Virtualized Infinite Scroll

**`src/components/chat/ChatMessages.tsx`** — The most complex component. Combines bidirectional `useInfiniteQuery` with `useVirtualizer`.

**Query structure:**
```typescript
queryKey: ['messages', conversationId, anchorMessageId]
//                                      ^ null = from end
//                                      ^ number = centered on that message
```

**Virtualizer setup:**
- `count`: exactly `allMessages.length` — NO loader rows in the count (this was a critical fix, see [bugs section](#bugs-that-were-fixed-and-why))
- `estimateSize`: varies by message type (72px text, 220px image, 200px video, 120px buttons)
- `measureElement`: attached to each rendered row via ref — measures actual height after render for accurate positioning
- `overscan: 5` — renders 5 extra items above and below the viewport for smooth scrolling
- `getItemKey`: uses `message.id` for stable React keys across page loads

**Loading indicators:** Rendered as normal divs OUTSIDE the virtualizer container (before/after), not as virtual rows. This prevents them from affecting the virtualizer's count or triggering cascade loads.

**Eight `useEffect` hooks (in order):**

1. **Sync scrollToMessageId to anchorMessageId** — When search/reply sets a target, update the anchor to change the query key
2. **Reset on conversation change** — Clear anchor, reset didInitialScroll
3. **Sync hasNextPage to store** — So ChatFloatingActions knows whether newer pages exist
4. **Scroll to target message** — After data loads with the anchor, find the message index and `scrollToIndex(center)`
5. **Initial auto-scroll to bottom** — On first load (no anchor), scroll to last message
6. **goToRecentCounter** — Force scroll to bottom when button is clicked
7. **Scroll preservation on prepend** — Save scrollHeight before older messages load, restore after
8. **Simulated new messages** — Every 15s, if not at bottom, adds a pending message to store

**The `handleScroll` callback** (attached to the scroll container's `onScroll`):
```
scrollTop < 50px -> load older messages (fetchPreviousPage)
scrollHeight - scrollTop - clientHeight < 50px -> load newer messages (fetchNextPage)
scrollHeight - scrollTop - clientHeight < 80px -> setIsAtBottom(true)
```

**Why 50px threshold for loading:** Small enough that the user has to actually reach the edge, large enough that loading starts before they see a blank area. The 80px threshold for "at bottom" is slightly larger to give a comfortable "close enough" feel.

### MessageItem — 6 Message Types

**`src/components/chat/MessageItem.tsx`**

Renders 6 message types with sender-based alignment:

| Sender | Alignment | Background | Avatar Color |
|--------|-----------|------------|--------------|
| customer | left | bg-muted | blue |
| ai | right | bg-primary/10 | violet |
| user (agent) | right | bg-green-50 | green |

**Message types:**
1. **text** — `<p>` with `whitespace-pre-wrap`
2. **image** — 240x180 container with `<img loading="lazy">`
3. **audio** — Mic icon + waveform placeholder + play button + duration
4. **video** — 240x160 container with centered play button overlay
5. **buttons** — Text content + column of `Button` components for each option

**Reply preview:** If `message.replyToId` exists, shows a clickable bar above the message bubble:
```
<reply-icon> "First 60 chars of original message..."
```
Clicking calls `onReplyClick(message.replyToId)` which triggers the same anchor mechanism as search.

### ChatInput

**`src/components/chat/ChatInput.tsx`**

- Auto-growing textarea (max 120px height)
- Enter sends, Shift+Enter adds newline
- Paperclip button (attachment placeholder)
- Smile button (emoji placeholder)
- Send button (disabled when empty)
- Currently logs to console — replace `handleSend` with API call + query invalidation for real use

### ChatFloatingActions — "Ir para mensagens recentes"

**`src/components/chat/NewMessageIndicator.tsx`**

A floating button positioned `absolute bottom-4 left-1/2` inside the chat messages area. Shows in two mutually exclusive states:

**State 1 — New pending messages** (`pendingMessages.length > 0`):
- Primary button: "N novas mensagens" with ChevronDown icon
- Clicking: clears pending messages + calls `goToRecentMessages()`

**State 2 — Not at bottom / has newer pages** (`!isAtBottom || hasNewerPages`):
- Secondary button: "Ir para mensagens recentes" with ArrowDown icon
- Clicking: same action — `goToRecentMessages()`

**Hidden when:** `isAtBottom && !hasNewerPages && pendingMessages.length === 0`

---

## Critical Mechanisms

### 1. Scroll-Position-Based Loading (NOT Virtual Index)

**Why:** The first version used virtual item indices to trigger loading — checking if `firstItem.index === 0` meant "top loader is visible." But with `overscan: 5`, the top/bottom loader rows were ALWAYS in the rendered range. This created a cascade: load page -> loader still visible -> load next page -> repeat until all data loaded.

**Fix:** Use `el.scrollTop < 50px` and `el.scrollHeight - el.scrollTop - el.clientHeight < 50px` on the actual scroll container. Loading only triggers when the user physically scrolls near an edge. Loader rows were removed from the virtualizer count entirely.

### 2. Message Search — Anchor — Reload Around Message

```
ChatHeader.searchMessages("hello")     <- useQuery to API
  -> User clicks result (id=45)
  -> setScrollToMessageId(45)           <- store
  -> ChatMessages effect: setAnchorMessageId(45)  <- store
  -> queryKey: ['messages', 'conv-1', 45]  <- changed!
  -> TanStack Query: cache miss, fetch aroundMessageId=45
  -> API: returns messages 40-49 centered on 45
  -> Dedup + sort -> allMessages = [40,41,42,43,44,45,46,47,48,49]
  -> Virtualizer re-renders with new data
  -> Scroll effect: find index of id=45 -> scrollToIndex(5, center)
  -> Highlight: className includes animate-pulse for 600ms
  -> After 600ms: setScrollToMessageId(null) -> highlight removed
  -> User can now scroll up (loads 30-39) or down (loads 50-59)
```

### 3. Reply Click — Scroll to Original Message

Same mechanism as search. When user clicks a reply preview:
```
MessageItem.onReplyClick(originalMessageId)
  -> ChatView.handleReplyClick -> setScrollToMessageId(id)
  -> Same flow as search (anchor changes, query refetches, scrolls to message)
```

If the original message is already in the loaded data (same page), the virtualizer just scrolls to it. If it's far away, the anchor change causes a full reload centered on that message.

### 4. New Message Indicator While Scrolled Up

Every 15 seconds, if `!isAtBottom`, ChatMessages creates a fake incoming message and calls `addPendingMessage()`. This pushes to the `pendingMessages` array in the store.

`ChatFloatingActions` reads `pendingMessages.length` and shows "N novas mensagens" when > 0.

Clicking calls `goToRecentMessages()` which clears pending, resets anchor, and increments `goToRecentCounter` -> ChatMessages scrolls to bottom.

**In production:** Replace the `setInterval` simulation with WebSocket/SSE message events. The same `addPendingMessage` call works regardless of source.

### 5. "Ir para mensagens recentes" — Two Cases

**Case A — User just scrolled up (anchor is null, hasNewerPages is false):**
- All recent messages are already loaded in the query cache
- `goToRecentMessages()` sets anchor to null (already null), but increments `goToRecentCounter`
- ChatMessages `useEffect` on `goToRecentCounter`: `virtualizer.scrollToIndex(lastItem, end)` + `setIsAtBottom(true)`
- Result: instant scroll, no refetch needed

**Case B — User is viewing a search/reply result (anchor is set, hasNewerPages is true):**
- Recent messages are NOT in the query cache (we're looking at old messages)
- `goToRecentMessages()` sets anchor to null -> query key changes -> TanStack Query refetches from the end
- `didInitialScroll.current` is reset to false
- After data arrives, the initial-load effect fires and scrolls to the last message
- Result: refetch + scroll, ~300ms delay for the API call

### 6. Scroll Position Preservation on Prepend

When older messages load (scroll up), new items are prepended to the array. Without correction, the scroll position would jump because the container height increased above the current viewport.

```
Before:  scrollHeight=2000, scrollTop=0  (viewing top)
Load:    10 new messages prepended, each ~72px = ~720px added above
After:   scrollHeight=2720, scrollTop=0  (WRONG: now viewing the NEW top)
Fix:     scrollTop = 0 + (2720 - 2000) = 720  (correct: still viewing same content)
```

Two effects handle this:
1. When `isFetchingPreviousPage` becomes true: save `scrollHeight` and `scrollTop`
2. When `allMessages.length` changes: calculate height diff and adjust `scrollTop`

### 7. Initial Auto-Scroll to Bottom

```typescript
useEffect(() => {
  if (anchorMessageId != null) return    // Don't override search/reply scroll
  if (allMessages.length > 0 && !isLoading && !didInitialScroll.current) {
    didInitialScroll.current = true      // Only run once per conversation
    requestAnimationFrame(() => {        // Wait for virtualizer to measure
      virtualizer.scrollToIndex(allMessages.length - 1, { align: 'end' })
    })
  }
}, [anchorMessageId, allMessages.length, isLoading, virtualizer])
```

`requestAnimationFrame` is necessary because the virtualizer needs one frame to calculate total size and item positions after data changes. Scrolling immediately would target stale positions.

---

## Bugs That Were Fixed and Why

### Bug 1: All messages loading automatically on open

**Symptom:** Opening a chat would cascade-load every page until all messages were fetched.

**Root cause:** Loader rows were part of the virtualizer count. With `overscan: 5`, the top loader (index 0) and bottom loader (last index) were always in `getVirtualItems()`. The useEffect checked `firstItem.index === 0` to trigger older message loading — but this was always true.

**Fix:**
1. Removed loader rows from virtualizer count (only real messages)
2. Replaced virtual-index-based loading with scroll-position-based loading (`el.scrollTop < 50px`)
3. Loading indicators rendered as normal divs outside the virtualizer

### Bug 2: "Ir para mensagens recentes" not working when scrolled up

**Symptom:** Clicking the button when you had just scrolled up (no search/reply) did nothing.

**Root cause:** `goToRecentMessages()` set `anchorMessageId` to `null` — but it was already `null` (no search was active). Query key didn't change, no refetch. `didInitialScroll.current` was `true` from initial load, so the auto-scroll effect didn't fire.

**Fix:** Added `goToRecentCounter` (a number) to the store, incremented on each click. ChatMessages watches it with a separate `useEffect` that force-scrolls to the last item and sets `isAtBottom(true)`.

---

## How to Replace Mock API with Real Backend

### 1. Replace `api/chat-api.ts` functions

The three functions have clean signatures — swap the implementation:

```typescript
// fetchConversations(cursor: number, limit: number, filters: ConversationFilters)
// -> GET /api/conversations?cursor=0&limit=15&search=...&tag=...&orderBy=...
// -> Return: { items: Conversation[], nextCursor: number | null }

// fetchMessages(conversationId, { messageIdBefore?, messageIdAfter?, aroundMessageId?, limit? })
// -> GET /api/conversations/:id/messages?before=141&limit=10
// -> GET /api/conversations/:id/messages?after=49&limit=10
// -> GET /api/conversations/:id/messages?around=45&limit=10
// -> Return: { items: Message[], prevCursor: number | null, nextCursor: number | null }

// searchMessages(conversationId, query)
// -> GET /api/conversations/:id/messages/search?q=hello
// -> Return: Message[]
```

### 2. Replace simulated new messages with WebSocket

In `ChatMessages.tsx`, replace the `setInterval` block with:

```typescript
useEffect(() => {
  const ws = new WebSocket(`ws://api/conversations/${conversationId}/stream`)
  ws.onmessage = (event) => {
    const message: Message = JSON.parse(event.data)
    if (!isAtBottom) {
      addPendingMessage(message)
    } else {
      // Invalidate query to show the new message
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
    }
  }
  return () => ws.close()
}, [conversationId, isAtBottom])
```

### 3. Implement real message sending

In `ChatInput.tsx`, replace `console.log` with:

```typescript
const sendMutation = useMutation({
  mutationFn: (content: string) =>
    axios.post(`/api/conversations/${activeConversation.id}/messages`, {
      content,
      type: 'text',
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['messages', activeConversation.id],
    })
    goToRecentMessages() // Scroll to bottom to see the sent message
  },
})
```

### 4. SQL query example for cursor-based messages

```sql
-- Load around message ID 45 (limit 10)
SELECT * FROM messages
WHERE conversation_id = 'conv-1'
  AND id >= (
    SELECT id FROM messages WHERE id <= 45
    ORDER BY id DESC LIMIT 1 OFFSET 4
  )
ORDER BY id ASC
LIMIT 10;

-- Load older (before ID 41)
SELECT * FROM messages
WHERE conversation_id = 'conv-1' AND id < 41
ORDER BY id DESC
LIMIT 10;
-- Then reverse the result in application code

-- Load newer (after ID 49)
SELECT * FROM messages
WHERE conversation_id = 'conv-1' AND id > 49
ORDER BY id ASC
LIMIT 10;
```

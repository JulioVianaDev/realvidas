# Multi-Channel Client Merge Architecture

## The Problem

A SaaS platform receives messages from multiple social media channels (WhatsApp, Instagram, Messenger, etc.). Each channel creates an independent contact/customer. The same real person can appear as two separate clients — one from Instagram, another from WhatsApp.

When an operator identifies that two clients are the same person, the system must **merge** them into one. After the merge, querying either client ID must return the complete conversation history across all channels.

### Why this is hard

The naive approach — update every `conversation.client_id` and `message.client_id` to the winner — is destructive at scale:

- A client with 10,000 conversations means 10,000 row UPDATEs
- Each UPDATE triggers index rebuilds on `client_id`, `channel+client_id`, etc.
- During the UPDATE, those rows are locked — reads block or return stale data
- Messages are even worse: a single client could have 500,000+ messages

**This architecture solves the problem by never touching conversations or messages during a merge.**

---

## Data Model

```
Client (small table — one row per person)
├── id (PK)
├── name, email, phone
├── merged_into → Client.id (null = active, filled = absorbed)
├── created_at, updated_at
│
├── Contact[] (few per client — one per channel)
│   ├── id (PK)
│   ├── client_id → Client.id
│   ├── channel ('whatsapp' | 'instagram' | 'messenger')
│   ├── token (phone number, PSID, etc.)
│   └── active
│
└── Conversation[] (many per client — never modified on merge)
    ├── id (PK)
    ├── client_id → Client.id (original, immutable after creation)
    ├── contact_id → Contact.id
    ├── channel
    ├── status ('open' | 'waiting' | 'closed')
    ├── last_message_at
    │
    └── Message[] (massive table — never modified on merge)
        ├── id (PK)
        ├── conversation_id → Conversation.id
        ├── direction ('inbound' | 'outbound')
        ├── content
        ├── media_url
        └── sent_at
```

### Key Relationships

| Relationship | Cardinality | Notes |
|---|---|---|
| Client → Contact | 1:N (few) | One per channel. Moved to winner on merge. |
| Client → Conversation | 1:N (many) | **Never moved.** Stays with original client_id. |
| Conversation → Message | 1:N (massive) | **Never moved.** Stays with original conversation_id. |
| Client → Client (merged_into) | N:1 | Self-referential. Points losers to the canonical winner. |

---

## How Merge Works

When merging client A (loser) into client B (winner), the transaction does:

| Step | Operation | Rows touched |
|---|---|---|
| 1 | Move contacts: `UPDATE contacts SET client_id = B WHERE client_id = A` | 1-5 (one per channel) |
| 2 | Mark loser: `UPDATE clients SET merged_into = B WHERE id = A` | 1 |
| 3 | Flatten chain: `UPDATE clients SET merged_into = B WHERE merged_into = A` | 0-few |
| 4 | Audit log: `INSERT INTO client_merges (winner_id, loser_id, ...)` | 1 |

**Total: ~5-10 rows touched. Conversations and messages: zero.**

### Chain Flattening

Step 3 prevents deep chains. Example:

1. Merge A into B → A.merged_into = B
2. Merge B into C → B.merged_into = C, **and** A.merged_into changes from B to C

After flattening, every loser always points directly to the final winner. `canonical()` is always a single query — no loops.

### Why contacts are moved but conversations are not

**Contacts represent active API tokens.** When the system needs to send a WhatsApp message, it looks up `Contact WHERE client_id = X AND channel = 'whatsapp'`. If the contact still points to the loser, the system can't find it. Contacts must be moved, and there are only 1-5 per client.

**Conversations are historical records.** They're never looked up by "give me the conversation for this client to send a message." They're read for display. The read query can resolve the family at query time — cheap, because the clients table is small.

---

## How Read Queries Work

Every read query that needs "all conversations for a client" uses a subquery on the clients table:

```sql
WHERE conv.client_id IN (
  SELECT id FROM clients
  WHERE id = :canonical OR merged_into = :canonical
)
```

This subquery:
- Hits the PK index for `id = :canonical`
- Hits the `merged_into` index for `merged_into = :canonical`
- Returns a small list of UUIDs (the canonical + all losers)
- The outer query then uses the conversation indexes normally

### Query Methods

| Method | Use case | How it works |
|---|---|---|
| `listConversations(clientId)` | "Show me all chats for this client" | family subquery + order by last_message_at DESC |
| `listConversationsByChannel(clientId, channel)` | "Show me only Instagram chats" | family subquery + channel filter |
| `listConversationsByContact(contactId)` | "Show me chats from this specific token" | direct contact_id lookup, no family needed |
| `listMessages(conversationId)` | "Show me messages in this chat" | direct conversation_id lookup |
| `listClientHistory(clientId)` | "Show me ALL messages across ALL channels, as a timeline" | family subquery + JOIN conversations → messages |

### Index Strategy

| Index | Table | Covers |
|---|---|---|
| `merged_into` | clients | family subquery, chain flattening |
| `client_id` | contacts | contact lookup, merge contact move |
| `(channel, token)` UNIQUE | contacts | incoming message routing |
| `idx_conv_client_last_msg` (client_id, last_message_at) | conversations | listConversations sorted pagination |
| `idx_conv_contact` (contact_id) | conversations | listConversationsByContact |
| `idx_conv_channel_client` (channel, client_id) | conversations | listConversationsByChannel |
| `idx_msg_conv_sent` (conversation_id, sent_at) | messages | listMessages sorted pagination |

---

## Walkthrough: A Merge B, Then B Merge C

### Initial state

- Client A: 3,000 conversations (Instagram)
- Client B: 2,000 conversations (WhatsApp)
- Client C: 500 conversations (Messenger)

### After merge A into B

- Rows touched: ~5 (contacts + client pointer)
- A.merged_into = B
- A's 3,000 conversations: untouched, still have `client_id = A`
- `listConversations(A)` → canonical = B → family = [B, A] → returns 5,000 conversations

### After merge B into C

- Rows touched: ~7 (contacts + client pointer + flatten A)
- B.merged_into = C
- A.merged_into = C (flattened from B to C)
- All 5,500 conversations: untouched, still have their original client_ids
- `listConversations(A)` → canonical = C → family = [C, B, A] → returns 5,500 conversations

**Zero conversation or message rows were modified in either merge.**

---

## Pros

1. **Merge is O(1)** — cost depends on number of channels (tiny), not number of conversations/messages
2. **No locks on hot tables** — conversations and messages are never write-locked during merge
3. **Immutable history** — conversation.client_id preserves who originally created it (useful for auditing)
4. **Chain-safe** — flattening at merge time guarantees canonical() is always 1 query
5. **Audit trail** — client_merges table records every merge with who/when
6. **Read queries are simple** — subquery on a small table, then normal indexed lookups
7. **No data migration needed on merge** — the biggest tables are never altered

## Cons

1. **Every client-scoped read pays the subquery cost** — for non-merged clients this is wasted work (subquery returns 1 ID). In practice this is negligible because the clients table is small and fully cached.
2. **Family subquery returns N+1 IDs** — if a client absorbed 50 others, the `IN (...)` clause has 51 UUIDs. PostgreSQL handles this fine up to hundreds. Beyond that, consider a materialized `client_family` table.
3. **Contacts are moved** — if an external system caches `contact.client_id`, it becomes stale after merge. Contacts should always be looked up fresh.
4. **No undo** — merges are one-way. The audit log records what happened, but reversing a merge requires a manual process.
5. **Deleted/soft-deleted clients** — if a loser client is later soft-deleted, its conversations become orphaned from the family subquery. Add a `deleted_at` check or keep merged clients alive.

---

## When to Reconsider This Architecture

- **If a single canonical client absorbs 500+ losers**: the `IN (...)` clause gets large. Solution: create a `client_family(canonical_id, member_id)` materialized table updated on merge.
- **If you need real-time message counts per canonical client**: the cross-family aggregation is expensive. Solution: maintain a denormalized counter on the canonical client, incremented by the message ingestion pipeline.
- **If you add full-text search on messages**: the search index should map messages to canonical_id, not original client_id. The search indexer must be merge-aware.

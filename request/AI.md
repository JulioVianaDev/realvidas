# AI Context Document — Multi-Channel Client Merge System

> This document is for AI assistants working on this codebase.
> Read this before making changes. It explains the architecture decisions, invariants you must preserve, and how to extend the system safely.

---

## System Overview

This is a multi-channel messaging platform where one real person (Client) can have contacts across WhatsApp, Instagram, Messenger, etc. Clients can be merged when operators discover two records represent the same person.

**Reference implementation:** `docs.ts`

**Core entities:** Client, Contact, Conversation, Message, ClientMerge

---

## Critical Invariants (DO NOT BREAK)

### 1. Conversations and Messages are NEVER modified on merge

The entire architecture depends on this. Merge only touches:
- `contacts.client_id` (moved to winner — few rows)
- `clients.merged_into` (pointer to winner — 1 row)
- `clients.merged_into` for chain flattening (few rows)
- `client_merges` insert (audit — 1 row)

If you need to "move" conversations to the winner, you are going in the wrong direction. The read queries handle this with a subquery on the clients table.

### 2. Chain flattening must happen inside the merge transaction

When merging B into C, all clients that had `merged_into = B` must be updated to `merged_into = C` in the same transaction. This guarantees `canonical()` is always a single-hop lookup (1 query). Without this, you'd need a loop that follows the chain — slower and fragile.

### 3. The family subquery pattern

Every query that needs "all data for a client" uses:

```sql
WHERE table.client_id IN (
  SELECT id FROM clients WHERE id = :canonical OR merged_into = :canonical
)
```

This returns the canonical ID plus all loser IDs that point to it. The clients table is small and indexed — this subquery is fast.

**When adding new queries that filter by client, always use `familySubquery()`.** Do not use a simple `WHERE client_id = :id` unless you intentionally want to exclude merged history.

### 4. canonical() must be called before any family-scoped read

The input `clientId` could be a loser. `canonical()` resolves it to the winner. All family subqueries use the canonical ID as the anchor.

```typescript
const canonical = await this.canonical(clientId)
// then use :canonical in familySubquery()
```

### 5. Contacts are always moved to the winner

Unlike conversations, contacts represent **active API tokens** used to send messages. They must live on the canonical client so the system can find them.

---

## Entity Relationships

```
Client
  merged_into → Client (null = active, filled = absorbed by winner)
  contacts    → Contact[] (moved to winner on merge)
  conversations → Conversation[] (NEVER moved)

Contact
  client_id → Client (the canonical owner)
  channel   → 'whatsapp' | 'instagram' | 'messenger'
  token     → external platform identifier

Conversation
  client_id  → Client (original creator — immutable after creation)
  contact_id → Contact (which token started this conversation)
  channel    → same as contact.channel
  messages   → Message[]

Message
  conversation_id → Conversation
  direction       → 'inbound' | 'outbound'
  content, media_url, sent_at
```

---

## Index Map

Use these when writing queries. If you add a new query pattern, check if an existing index covers it or add one.

| Index name | Columns | Purpose |
|---|---|---|
| PK on clients.id | id | canonical() lookup |
| idx on clients.merged_into | merged_into | family subquery, chain flattening |
| idx on contacts.client_id | client_id | find contacts for a client |
| UNIQUE on contacts (channel, token) | channel, token | incoming message routing |
| idx_conv_client_last_msg | (client_id, last_message_at) | listConversations pagination |
| idx_conv_contact | (contact_id) | listConversationsByContact |
| idx_conv_channel_client | (channel, client_id) | listConversationsByChannel |
| idx_msg_conv_sent | (conversation_id, sent_at) | listMessages pagination |

---

## How to Add New Features

### Adding a new query (e.g., "conversations with unread messages for a client")

1. Call `canonical()` first
2. Use `familySubquery()` in the WHERE clause
3. Add additional filters after the family condition
4. Check if existing indexes cover the ORDER BY / WHERE — add a composite index if needed

```typescript
async listUnread(clientId: string, page = 1, limit = 20) {
  const canonical = await this.canonical(clientId)
  return this.conversations
    .createQueryBuilder('conv')
    .where(`conv.client_id IN ${this.familySubquery()}`, { canonical })
    .andWhere('conv.status = :status', { status: 'open' })
    .andWhere('conv.last_message_at > conv.last_read_at') // example
    .orderBy('conv.last_message_at', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount()
}
```

### Adding a new channel (e.g., Telegram)

No schema changes needed. The `channel` column is a string. Just:
1. Create a Contact with `channel = 'telegram'`
2. Create Conversations with `channel = 'telegram'`
3. Everything else works automatically

### Adding a new entity linked to Client (e.g., Notes, Tags)

If the new entity should include merged history:
- Add `client_id` column with an index
- Use `familySubquery()` in read queries
- Do NOT update the entity's client_id during merge

If the new entity should only belong to the canonical client:
- Add `client_id` column
- Use `WHERE client_id = :canonical` (not the family subquery)
- Move rows to winner during merge (only if the table is small)

### Implementing merge undo

Current merges are one-way. To add undo:
1. The `client_merges` audit table already records winner/loser/timestamp
2. Undo = set `loser.merged_into = null` + move contacts back to loser
3. Conversations don't need to be moved (they still have the original client_id)
4. Must also un-flatten: find clients that were flattened in the same merge and restore their previous `merged_into` (store original value in client_merges)

---

## Common Mistakes to Avoid

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| `UPDATE conversations SET client_id = winner WHERE client_id = loser` | Touches thousands of rows, locks table, kills performance | Use family subquery at read time |
| `UPDATE messages SET client_id = winner` | Messages don't even have client_id (by design) | Messages belong to conversations, not directly to clients |
| `WHERE client_id = :clientId` without canonical() | Misses all merged history — returns only one client's data | Always resolve canonical first, then use familySubquery |
| Adding `client_id` to messages | Redundant (conversation already links to client), would require mass updates on merge | Access client through conversation |
| Looping in canonical() | Chains are already flattened, loop is unnecessary overhead | Single findOne is sufficient |
| Merging into a loser | A loser has `merged_into != null` — merging into it creates orphans | Validate `winner.mergedInto === null` before merge |

---

## Performance Characteristics

| Operation | Cost | Notes |
|---|---|---|
| Merge | O(contacts) ≈ O(1) | 3-5 rows: contacts + 2 client updates + 1 insert |
| canonical() | 1 PK lookup | Always single hop due to chain flattening |
| listConversations | 1 subquery + 1 indexed scan | Subquery on small clients table |
| listMessages | 1 indexed scan | Direct conversation_id + sent_at index |
| listClientHistory | 1 subquery + 1 JOIN | Cross-channel timeline, paginated |

### Scaling Thresholds

- **< 100 merged losers per canonical**: current approach works perfectly
- **100-500 merged losers**: `IN (...)` gets large but PostgreSQL handles it. Monitor query plans.
- **500+ merged losers**: consider a `client_family(canonical_id, member_id)` materialized table that the family subquery reads from instead of scanning clients

---

## Tech Stack

- **ORM:** TypeORM (entities use decorators)
- **Framework:** NestJS (service uses @Injectable, @InjectRepository)
- **Database:** PostgreSQL assumed (UUID PKs, index strategies)
- **Pattern:** Repository pattern with QueryBuilder for complex queries

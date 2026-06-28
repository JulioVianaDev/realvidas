# AGENTS.md

## Project Overview

This repository is a **monorepo full-stack multitenant SaaS** composed of shared packages, a frontend app, and a NestJS backend.

The main responsibility of any agent working in this codebase is to **understand the tenant isolation model before creating features**, especially anything related to **AI flows, catalog generation, or automation logic**.

---

## Repository Structure

```text
packages/
  types/                  # Shared types between backend and frontend

.cursor/                  # Cursor rules and coding guidance

apps/
  frontend/               # Vite + React + shadcn + Tailwind + React Query
  backend/                # NestJS API
```

### Shared Types

All reusable DTOs, interfaces, enums, and contracts shared between frontend and backend live in:

```text
@packages/types
```

Always reuse existing shared contracts before creating duplicated types.

---

## Cursor Rules

Before generating code, read:

```text
@.cursor/
```

This folder contains the project-specific coding rules, conventions, patterns, and internal standards.

Agents must follow those rules as the **source of truth for implementation style**.

---

## Frontend Stack

Frontend application path:

```text
@apps/frontend
```

### Stack

- Vite
- React
- shadcn/ui
- TailwindCSS
- React Query

### Frontend Responsibilities

When implementing UI:

- Prefer reusable shadcn components
- Keep API contracts aligned with `@packages/types`
- Use React Query for async state
- Keep tenant-specific data scoped by selected tenant context
- Never hardcode tenant ids

---

## Backend Stack

Backend application path:

```text
@apps/backend
```

### Stack

- NestJS
- PostgreSQL
- Multitenant database architecture

---

## Critical Architecture Rule: Multitenancy

This is the **most important rule in the entire project**.

The system uses **one database per tenant**.

Database-related infrastructure can be found in:

```text
@apps/backend/src/infra/postgres-databases
```

This folder contains the logic for the **two database types used by the platform**.

### Mandatory Rule

Anything related to:

- AI flows
- catalog customization
- project-specific automation
- generated product logic
- customer-specific pipelines
- workflow state
- embeddings / prompts / AI memory

**must be stored inside the tenant database**, never in the global database.

This exists because every tenant customizes the project differently.

All tables, migrations, and services must execute against the **tenant database connection** or into main if sayed for user.

## Implementation Checklist for Agents

Before coding, validate this checklist:

- [ ] Read `.cursor` rules
- [ ] Reuse shared types from `@packages/types`
- [ ] Confirm feature belongs to tenant scope
- [ ] Use tenant database connection
- [ ] Create migrations only in tenant or in main database if needed database
- [ ] Keep frontend contracts shared
- [ ] Keep APIs tenant-aware
- [ ] Avoid global state leakage
- [ ] All types received from frontend and sended to backend need has your own type into `@packages/types`
- [ ] Avoid create many maps to format structured keep the most possible than response of api into frontend

---

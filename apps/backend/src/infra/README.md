# Infrastructure Layer

Two separate, focused global modules for repository management.

## Modules

### 1. DatabaseModule (Prisma) ✅ Active

**Purpose**: Prisma-based repositories for PostgreSQL

**Location**: `infra/database/`

**Import**:
```typescript
import { REPOSITORY_TOKENS } from '@infra/database';
```

**Repositories**: 8 Prisma repositories (User, Calendar, Enterprise, etc.)

---

### 2. ElasticSearchModule 📦 Ready

**Purpose**: ElasticSearch-based repositories

**Location**: `infra/elasticsearch/`

**Import**:
```typescript
import { ELASTICSEARCH_REPOSITORY_TOKENS } from '@infra/elasticsearch';
```

**Repositories**: Product, Log (commented, ready to activate)

---

## Quick Start

### Using Prisma Repository

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '@infra/database';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserContractRepository,
  ) {}
}
```

### Using ElasticSearch Repository (when activated)

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ELASTICSEARCH_REPOSITORY_TOKENS } from '@infra/elasticsearch';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ELASTICSEARCH_REPOSITORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductContractRepository,
  ) {}
}
```

---

## Architecture

```
Application Layer (Services)
         │
         │ @Inject(REPOSITORY_TOKENS.*)
         │
         ▼
┌─────────────────────────────────────────┐
│       DatabaseModule (@Global)          │
│                                         │
│  • PrismaService                        │
│  • 8 Prisma Repositories                │
│                                         │
└─────────────────────────────────────────┘
         │
         ▼
    PostgreSQL

┌─────────────────────────────────────────┐
│    ElasticSearchModule (@Global)        │
│                                         │
│  • ElasticSearch Client                 │
│  • ES Repositories (when needed)        │
│                                         │
└─────────────────────────────────────────┘
         │
         ▼
   ElasticSearch
```

---

## Benefits

| Feature | Benefit |
|---------|---------|
| **Separation** | Prisma & ES in different modules |
| **Global** | Import once, use everywhere |
| **Type-Safe** | Symbol tokens, no typos |
| **Clean** | Feature modules stay simple |
| **Testable** | Easy to mock repositories |

---

## Documentation

- **USAGE_GUIDE.md** - Complete usage examples
- **database/README.md** - Prisma module details
- **elasticsearch/README.md** - ElasticSearch module details

---

## Current Status

- ✅ DatabaseModule: Active in app.module.ts
- ✅ UserService: Updated with new tokens
- ✅ UserModule: Cleaned up
- 📦 ElasticSearchModule: Created, ready to activate

---

## Environment

```env
DATABASE_URL="postgresql://..."           # Required
ELASTIC_SEARCH_URL="http://localhost:9200"  # When using ES module
```

---

**See USAGE_GUIDE.md for detailed instructions**


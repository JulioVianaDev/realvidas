# Infrastructure Modules - Usage Guide

## Overview

The infrastructure is split into two separate global modules:

1. **DatabaseModule** - For Prisma/PostgreSQL repositories
2. **ElasticSearchModule** - For ElasticSearch repositories (ready to use when needed)

## Structure

```
infra/
├── database/              # Prisma repositories
│   ├── database.module.ts
│   ├── database.providers.ts
│   ├── tokens/
│   │   ├── database-token.ts
│   │   └── repository-tokens.ts
│   ├── index.ts
│   └── README.md
│
├── elasticsearch/         # ElasticSearch repositories
│   ├── elasticsearch.module.ts
│   ├── elasticsearch.providers.ts
│   ├── tokens/
│   │   ├── elasticsearch-token.ts
│   │   └── repository-tokens.ts
│   ├── index.ts
│   └── README.md
│
└── index.ts              # Exports both modules
```

## 1. Database Module (Prisma) - Current Setup ✅

### Import in app.module.ts

```typescript
import { DatabaseModule } from '@infra/database';

@Module({
  imports: [
    DatabaseModule,  // ✅ Already imported!
    // ... other modules
  ],
})
export class AppModule {}
```

### Use in Services

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '@infra/database';
import { IUserContractRepository } from './repositories/user.contract.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserContractRepository,
  ) {}

  async getUser(id: string) {
    return this.userRepository.getUserById(id);
  }
}
```

### Available Prisma Repository Tokens

```typescript
REPOSITORY_TOKENS.USER_REPOSITORY
REPOSITORY_TOKENS.CALENDAR_REPOSITORY
REPOSITORY_TOKENS.CALENDAR_EVENT_REPOSITORY
REPOSITORY_TOKENS.CALENDAR_SHARE_REPOSITORY
REPOSITORY_TOKENS.ENTERPRISE_REPOSITORY
REPOSITORY_TOKENS.ENTERPRISE_MEMBER_REPOSITORY
REPOSITORY_TOKENS.ENTERPRISE_INVITATION_REPOSITORY
REPOSITORY_TOKENS.EMPLOYEE_GOOGLE_EMAIL_REPOSITORY
```

### Feature Module Example (Clean!)

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  providers: [UserService],      // ✅ Just the service!
  controllers: [UserController],
})
export class UserModule {}

// No need to import:
// ❌ PrismaService
// ❌ UserPrismaRepository
// ❌ DatabaseModule
```

## 2. ElasticSearch Module - When You Need It

### Import in app.module.ts

```typescript
import { DatabaseModule } from '@infra/database';
import { ElasticSearchModule } from '@infra/elasticsearch';

@Module({
  imports: [
    DatabaseModule,
    ElasticSearchModule,  // Add when ready
    // ... other modules
  ],
})
export class AppModule {}
```

### Use in Services

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ELASTICSEARCH_REPOSITORY_TOKENS } from '@infra/elasticsearch';
import { IProductContractRepository } from './repositories/product.contract.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ELASTICSEARCH_REPOSITORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductContractRepository,
  ) {}
}
```

### Before Using ElasticSearch Module

Uncomment repositories in `elasticsearch.providers.ts`:

```typescript
// 1. Uncomment imports
import { ProductElasticSearchRepository } from '../../products/repositories/product.elastic-search.repository';

// 2. Uncomment providers
export const elasticsearchRepositoryProviders: Provider[] = [
  ProductElasticSearchRepository,
  {
    provide: ELASTICSEARCH_REPOSITORY_TOKENS.PRODUCT_REPOSITORY,
    useExisting: ProductElasticSearchRepository,
  },
];
```

## Adding New Repositories

### For Prisma Repository

**File**: `infra/database/tokens/repository-tokens.ts`
```typescript
export const REPOSITORY_TOKENS = {
  // ... existing
  MY_NEW_REPOSITORY: Symbol('MY_NEW_REPOSITORY'),
} as const;
```

**File**: `infra/database/database.providers.ts`
```typescript
import { MyNewPrismaRepository } from '../../my-module/repositories/my-new.prisma.repository';

export const repositoryProviders: Provider[] = [
  // ... existing
  MyNewPrismaRepository,
  {
    provide: REPOSITORY_TOKENS.MY_NEW_REPOSITORY,
    useExisting: MyNewPrismaRepository,
  },
];
```

### For ElasticSearch Repository

**File**: `infra/elasticsearch/tokens/repository-tokens.ts`
```typescript
export const ELASTICSEARCH_REPOSITORY_TOKENS = {
  // ... existing
  MY_NEW_REPOSITORY: Symbol('MY_NEW_REPOSITORY'),
} as const;
```

**File**: `infra/elasticsearch/elasticsearch.providers.ts`
```typescript
import { MyNewElasticSearchRepository } from '../../my-module/repositories/my-new.elastic-search.repository';

export const elasticsearchRepositoryProviders: Provider[] = [
  // ... existing
  MyNewElasticSearchRepository,
  {
    provide: ELASTICSEARCH_REPOSITORY_TOKENS.MY_NEW_REPOSITORY,
    useExisting: MyNewElasticSearchRepository,
  },
];
```

## Direct Database Client Access

### Prisma Client

```typescript
import { Inject } from '@nestjs/common';
import { DATABASE_TOKEN } from '@infra/database';
import { PrismaService } from '@prisma/client';

@Injectable()
export class CustomService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly prisma: PrismaService,
  ) {}
}
```

### ElasticSearch Client

```typescript
import { Inject } from '@nestjs/common';
import { ELASTICSEARCH_TOKEN } from '@infra/elasticsearch';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class CustomService {
  constructor(
    @Inject(ELASTICSEARCH_TOKEN)
    private readonly esClient: Client,
  ) {}
}
```

## Testing

### Mock Repository in Tests

```typescript
import { Test } from '@nestjs/testing';
import { REPOSITORY_TOKENS } from '@infra/database';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: jest.Mocked<IUserContractRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      getUserById: jest.fn(),
      createUser: jest.fn(),
      // ... other methods
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: REPOSITORY_TOKENS.USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should get user', async () => {
    mockUserRepository.getUserById.mockResolvedValue(mockUser);
    const result = await service.getUserById('1');
    expect(result).toEqual(mockUser);
  });
});
```

## Example: Updated UserService ✅

**Before:**
```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject('IUserContractRepository')  // ❌ String token
    private readonly userRepository: IUserContractRepository,
  ) {}
}
```

**After:**
```typescript
import { REPOSITORY_TOKENS } from '@infra/database';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)  // ✅ Type-safe Symbol
    private readonly userRepository: IUserContractRepository,
  ) {}
}
```

## Benefits

### ✅ Separation of Concerns
- Prisma repositories in one module
- ElasticSearch repositories in another
- Clear responsibility boundaries

### ✅ Cleaner Feature Modules
- No database imports
- No repository registrations
- Just service and controller

### ✅ Type Safety
- Symbol tokens prevent typos
- Compile-time error checking
- Better IDE autocomplete

### ✅ Easy Testing
- Simple mock injection
- Same tokens as production
- No real database needed

### ✅ Flexibility
- Use only what you need
- Import DatabaseModule only
- Add ElasticSearchModule later

## Environment Variables

```env
# Required for DatabaseModule
DATABASE_URL="postgresql://user:password@localhost:5432/agenda-ai"

# Required for ElasticSearchModule (when used)
ELASTIC_SEARCH_URL="http://localhost:9200"
```

## Quick Reference

| Module | Token Import | Client Access |
|--------|-------------|---------------|
| Database | `REPOSITORY_TOKENS` from `@infra/database` | `DATABASE_TOKEN` |
| ElasticSearch | `ELASTICSEARCH_REPOSITORY_TOKENS` from `@infra/elasticsearch` | `ELASTICSEARCH_TOKEN` |

## Current Status

- ✅ DatabaseModule: Ready and in use
- ✅ ElasticSearchModule: Created, repositories commented
- ✅ UserService: Updated to use new tokens
- ✅ UserModule: Cleaned up (no repository imports)

## Next Steps

1. Update other services to use `REPOSITORY_TOKENS` instead of string tokens
2. Clean up feature modules (remove PrismaService/repository imports)
3. When ready for ElasticSearch, uncomment repositories in `elasticsearch.providers.ts`
4. Add ElasticSearchModule to app.module.ts when needed


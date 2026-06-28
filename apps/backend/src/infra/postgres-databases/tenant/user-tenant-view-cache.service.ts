import { Inject, Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/infra/redis/redis-cache.service';
import { REDIS_TOKENS } from 'src/infra/redis/tokens/redis-tokens';

/** TTL for cached `users.currentTenantViewId` (seconds). */
export const USER_CURRENT_TENANT_VIEW_CACHE_TTL_SEC = 3600;

export function userCurrentTenantViewCacheKey(userId: string): string {
  return `user:currentTenantView:${userId}`;
}

/**
 * Redis cache for `UserEntity.currentTenantViewId` to keep tenancy resolution fast.
 * Invalidate or update when the user's active tenant view changes (e.g. PATCH my tenant).
 */
@Injectable()
export class UserTenantViewCacheService {
  constructor(
    @Inject(REDIS_TOKENS.REDIS_CACHE_SERVICE)
    private readonly redis: RedisCacheService,
  ) {}

  async get(userId: string): Promise<string | null> {
    const raw = await this.redis.getData<string | null>(
      userCurrentTenantViewCacheKey(userId),
    );
    if (raw === null) {
      return null;
    }
    return typeof raw === 'string' && raw.length > 0 ? raw : null;
  }

  async set(userId: string, tenantId: string): Promise<void> {
    await this.redis.saveData({
      key: userCurrentTenantViewCacheKey(userId),
      data: tenantId,
      time: USER_CURRENT_TENANT_VIEW_CACHE_TTL_SEC,
    });
  }

  async invalidate(userId: string): Promise<void> {
    await this.redis.deleteData(userCurrentTenantViewCacheKey(userId));
  }
}

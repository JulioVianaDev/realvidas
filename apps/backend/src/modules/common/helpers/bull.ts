import type { RedisOptions } from 'ioredis';
import { getRedisOptionsFromConfig } from 'src/config/config';

/**
 * Redis options for Bull / GroupMQ workers (same env vars as {@link redisClientFactory}).
 */
export function buildRedisOptions(): RedisOptions {
  const { host, port, password } = getRedisOptionsFromConfig();

  return {
    host,
    port,
    retryStrategy: (times: number) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    ...(password ? { password } : {}),
  };
}

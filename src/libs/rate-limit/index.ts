import { redisCache } from '@/libs/cache';

import { MemoryRateLimiter } from './memory';
import { RedisRateLimiter } from './redis';
import type { RateLimiter, RateLimitOptions } from './types';

export class AdaptiveRateLimiter implements RateLimiter {
  private memory: MemoryRateLimiter;
  private redis: RedisRateLimiter;

  constructor(options: RateLimitOptions) {
    this.memory = new MemoryRateLimiter(options.windowMs, options.max);
    this.redis = new RedisRateLimiter(options.prefix, options.windowMs, options.max);
  }

  private async getStore(): Promise<RateLimiter> {
    const client = await redisCache.getRedisClient();
    if (client) return this.redis;
    return this.memory;
  }

  async check(key: string): Promise<boolean> {
    const store = await this.getStore();
    return store.check(key);
  }

  async remaining(key: string): Promise<number> {
    const store = await this.getStore();
    return store.remaining(key);
  }

  async reset(key: string): Promise<void> {
    const store = await this.getStore();
    return store.reset(key);
  }
}

export const createRateLimiter = (options: RateLimitOptions): RateLimiter => {
  return new AdaptiveRateLimiter(options);
};

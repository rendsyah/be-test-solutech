import { redisCache } from '@/libs/cache';
import { logger } from '@/libs/logger';

import type { RateLimiter } from './types';

export class RedisRateLimiter implements RateLimiter {
  constructor(
    private readonly prefix: string,
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

  private buildKey(key: string): string {
    return `ratelimit:${this.prefix}:${key}`;
  }

  private async getClient() {
    return redisCache.getRedisClient();
  }

  async check(key: string): Promise<boolean> {
    const client = await this.getClient();
    if (!client) return true;

    try {
      const redisKey = this.buildKey(key);
      const count = await client.incr(redisKey);
      if (count === 1) {
        await client.expire(redisKey, Math.ceil(this.windowMs / 1000));
      }
      return count <= this.max;
    } catch (error) {
      logger.warn('Rate limit store error, allowing request', {
        message: error instanceof Error ? error.message : String(error),
      });
      return true;
    }
  }

  async remaining(key: string): Promise<number> {
    const client = await this.getClient();
    if (!client) return this.max;

    try {
      const count = await client.get(this.buildKey(key));
      return Math.max(0, this.max - Number(count ?? 0));
    } catch {
      return this.max;
    }
  }

  async reset(key: string): Promise<void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      await client.del(this.buildKey(key));
    } catch {
      // best-effort reset
    }
  }
}

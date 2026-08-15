import Redis from 'ioredis';

import { ENV } from '@/libs/env';
import { logger } from '@/libs/logger';

const globalForRedis = globalThis as unknown as { redis?: RedisCache };

type CacheValue = string | number | boolean | object | null;

class RedisCache {
  private client: Redis | null = null;
  private isAvailable = true;

  private disable(error: unknown): void {
    logger.warn('Redis unavailable, cache disabled', {
      message: error instanceof Error ? error.message : String(error),
    });
    this.isAvailable = false;
    this.client = null;
  }

  private async getClient(): Promise<Redis | null> {
    if (!this.isAvailable) return null;

    if (!this.client) {
      try {
        this.client = new Redis(ENV.REDIS_URL, {
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          retryStrategy: () => null,
        });
        this.client.on('error', (error) => {
          logger.warn('Redis error, cache disabled', { message: error.message });
          this.isAvailable = false;
        });
        await this.client.connect();
        await this.client.ping();
      } catch (error) {
        this.disable(error);
        return null;
      }
    }

    return this.client;
  }

  async getRedisClient(): Promise<Redis | null> {
    return this.getClient();
  }

  async get<T extends CacheValue>(key: string): Promise<T | null> {
    const client = await this.getClient();
    if (!client) return null;

    try {
      const value = await client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.disable(error);
      return null;
    }
  }

  async set(key: string, value: CacheValue, ttlSeconds: number): Promise<void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.disable(error);
    }
  }

  async del(pattern: string): Promise<void> {
    const client = await this.getClient();
    if (!client) return;

    try {
      const keys = await client.keys(pattern);
      if (keys.length === 0) return;
      await client.del(...keys);
    } catch (error) {
      this.disable(error);
    }
  }
}

export const redisCache = globalForRedis.redis ?? new RedisCache();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redisCache;
}

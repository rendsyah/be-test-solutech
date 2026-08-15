import type { RateLimiter } from './types';

type SlidingWindowEntry = {
  count: number;
  resetAt: number;
};

export class MemoryRateLimiter implements RateLimiter {
  private store = new Map<string, SlidingWindowEntry>();

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

  private sweepExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }

  private getEntry(key: string): SlidingWindowEntry {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || entry.resetAt <= now) {
      const fresh: SlidingWindowEntry = { count: 0, resetAt: now + this.windowMs };
      this.store.set(key, fresh);
      return fresh;
    }
    return entry;
  }

  async check(key: string): Promise<boolean> {
    this.sweepExpired();
    const entry = this.getEntry(key);
    if (entry.count >= this.max) return false;
    entry.count += 1;
    return true;
  }

  async remaining(key: string): Promise<number> {
    const entry = this.getEntry(key);
    return Math.max(0, this.max - entry.count);
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}

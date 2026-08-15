type SlidingWindowEntry = {
  count: number;
  resetAt: number;
};

export class RateLimiter {
  private store = new Map<string, SlidingWindowEntry>();

  constructor(
    private readonly windowMs: number,
    private readonly max: number,
  ) {}

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

  check(key: string): boolean {
    const entry = this.getEntry(key);
    if (entry.count >= this.max) return false;
    entry.count += 1;
    return true;
  }

  remaining(key: string): number {
    const entry = this.getEntry(key);
    return Math.max(0, this.max - entry.count);
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

export const loginRateLimiter = new RateLimiter(15 * 60 * 1000, 5);

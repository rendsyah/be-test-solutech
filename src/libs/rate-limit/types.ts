export interface RateLimiter {
  check(key: string): Promise<boolean>;
  remaining(key: string): Promise<number>;
  reset(key: string): Promise<void>;
}

export type RateLimitOptions = {
  prefix: string;
  windowMs: number;
  max: number;
};

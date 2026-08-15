import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const ENV = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().optional().default('redis://localhost:6379'),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1).default('1h'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
    SESSION_SECRET: z.string().min(1).optional().default('secret'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});

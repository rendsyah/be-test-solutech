import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const ENV = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(1).optional().default('secret'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const ENV = createEnv({
  server: {
    API_BASE_URL: z.string().optional().default('http://localhost:8080'),
    SIGN_SECRET: z.string().min(1).optional().default('secret'),
    SESSION_SECRET: z.string().min(1).optional().default('secret'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: {
    API_BASE_URL: process.env.API_BASE_URL,
    SIGN_SECRET: process.env.SIGN_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});

import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import { PrismaClient } from '@/generated/prisma/client';
import { ENV } from '@/libs/env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

function createAdapter(): PrismaPg {
  const pool = globalForPrisma.pgPool ?? new pg.Pool({ connectionString: ENV.DATABASE_URL });
  globalForPrisma.pgPool = pool;
  return new PrismaPg(pool);
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

# Solutech E-Commerce Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun REST API e-commerce (auth JWT, CRUD product dengan soft delete + pagination/search, order dengan transaction stok) menggunakan Prisma + PostgreSQL, arsitektur layered route-handler → service → repository, plus FE admin sederhana (nilai tambah).

**Architecture:** Next.js App Router route handlers sebagai API layer. Setiap domain (auth, product, order) mengikuti module pattern `src/modules/<domain>/` dengan folder `repositories/` (Prisma), `services/server` (business logic), `validations/` (Zod), `types/`. Route handler hanya thin wrapper: parse body → zod validate → panggil service → response envelope `{ status, success, message, data, errors, trace_id }`. Auth: JWT (jose) dual-mode — Bearer header (Postman) + httpOnly cookie (FE). Order creation memakai `prisma.$transaction` untuk decrement stok + hitung total secara atomik.

**Tech Stack:** Next.js 16 App Router, TypeScript, Prisma 6 + PostgreSQL 16 (docker-compose), jose (JWT), bcryptjs (password), Zod, winston (logging), React Query (FE), RHF (FE).

## Global Constraints

- Strict TS, **dilarang `any`** (pakai `unknown`).
- Import via alias `@/`.
- Layered: route handler → service → repository. Repository TIDAK berisi business logic.
- Semua input divalidasi Zod; HTTP status sesuai (200/201/400/401/404/409/500).
- Response envelope konsisten: `{ status, success, message, data, errors, trace_id }`.
- Docker compose: tambah service `db` (postgres:16) + volume.
- `.env.example` berisi `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`, `SESSION_SECRET`.
- Wajib deliverable: `prisma/create_tables.sql`, Prisma seed (1 user + produk), Postman collection, README.

---

### Task 1: Setup Prisma + PostgreSQL infra

**Files:**
- Create: `prisma/schema.prisma`
- Create: `docker-compose.yml` (modify: tambah service db)
- Modify: `package.json` (scripts db + prisma seed config)
- Modify: `.env.example`, `Makefile` (target db-up/db-down/db-migrate/db-seed)
- Create: `.env` (lokal, untuk dev — tidak di-commit)

**Interfaces:**
- Produces: `prisma/schema.prisma` (model User, Product, Order, OrderItem, enum), script `db:migrate`, `db:seed`, `db:generate`.

- [ ] **Step 1: Install deps**

```bash
pnpm add prisma @prisma/client && pnpm add -D tsx @types/bcryptjs
```

- [ ] **Step 2: Update docker-compose.yml** — tambah service postgres

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: solutech-db-container
    restart: unless-stopped
    environment:
      POSTGRES_USER: solutech
      POSTGRES_PASSWORD: solutech
      POSTGRES_DB: solutech
    ports:
      - 5432:5432
    volumes:
      - solutech-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U solutech -d solutech"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - shared-networks

  nextjs-app:
    image: ${REGISTRY_HOST}/nextjs-app:${IMAGE_TAG:-v1.0.0}
    restart: unless-stopped
    ports:
      - 127.0.0.1:${APP_PORT}:${APP_PORT}
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: ${APP_PORT}
      TZ: Asia/Jakarta
    networks:
      - shared-networks
    depends_on:
      db:
        condition: service_healthy

networks:
  shared-networks:
    name: shared-networks
    external: true

volumes:
  solutech-db-data:
```

> Catatan: `networks.shared-networks` bersifat external. Untuk dev lokal, cukup `docker compose up -d db`.

- [ ] **Step 3: Buat `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  USER
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         UserRole  @default(USER)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  orders       Order[]
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Decimal     @db.Decimal(12, 2)
  stock       Int         @default(0)
  deletedAt   DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]

  @@index([deletedAt])
  @@index([name])
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  status     OrderStatus @default(PENDING)
  totalPrice Decimal     @db.Decimal(12, 2)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[]

  @@index([userId])
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  productName String
  quantity    Int
  unitPrice   Decimal @db.Decimal(12, 2)
  subtotal    Decimal @db.Decimal(12, 2)

  @@index([orderId])
}
```

- [ ] **Step 4: Update package.json scripts + prisma seed config**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "format:check": "prettier --check .",
  "format:write": "prettier --write .",
  "generate:module": "node scripts/gen-module.mjs",
  "prepare": "husky",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio"
},
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

- [ ] **Step 5: Update `.env.example`**

```bash
# APP
APP_PORT=3000

# DATABASE
DATABASE_URL=postgresql://solutech:solutech@localhost:5432/solutech?schema=public

# AUTH
# generate secret using: openssl rand -base64 48
JWT_SECRET='secret'
JWT_EXPIRES_IN='1h'
BCRYPT_SALT_ROUNDS=10

# SESSION (iron-session for FE)
# generate secret using: openssl rand -base64 24
SESSION_SECRET='secret'
```

- [ ] **Step 6: Buat `.env` lokal (tidak di-commit) + `.gitignore` pastikan `.env` di-ignore**

```bash
cp .env.example .env
```

Periksa `.gitignore` sudah memuat `.env`. Jika belum, tambahkan.

- [ ] **Step 7: Jalankan Postgres + generate client + migrasi**

```bash
docker compose up -d db
npx prisma generate
npx prisma migrate dev --name init
```

Expected: migrasi sukses, client ter-generate.

- [ ] **Step 8: Generate `prisma/create_tables.sql`**

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/create_tables.sql
```

- [ ] **Step 9: Update Makefile** — tambah target db

```makefile
# Database
.PHONY: db-up
db-up:
	docker compose up -d db

.PHONY: db-down
db-down:
	docker compose down db

.PHONY: db-migrate
db-migrate:
	pnpm db:migrate

.PHONY: db-seed
db-seed:
	pnpm db:seed

.PHONY: db-generate
db-generate:
	pnpm db:generate
```

- [ ] **Step 10: Commit**

```bash
git add prisma package.json pnpm-lock.yaml docker-compose.yml .env.example Makefile
git commit -m "feat: setup prisma postgresql schema and infra"
```

---

### Task 2: Prisma client singleton + seed

**Files:**
- Create: `src/libs/db/prisma.ts`
- Create: `prisma/seed.ts`

**Interfaces:**
- Produces: `getPrismaClient()` / `prisma` (singleton PrismaClient), seed menjalankan 1 admin user + 1 user biasa + 10 produk.

- [ ] **Step 1: Buat `src/libs/db/prisma.ts`**

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Buat `prisma/seed.ts`**

```ts
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

const products = [
  { name: 'Kemeja Oxford Polos', description: 'Kemeja pria bahan oxford premium', price: 149000, stock: 50 },
  { name: 'Celana Chino Slim Fit', description: 'Celana chino pria slim fit', price: 189000, stock: 40 },
  { name: 'Sepatu Sneakers Putih', description: 'Sneakers kasual warna putih', price: 350000, stock: 30 },
  { name: 'Jaket Denim Vintage', description: 'Jaket denim model vintage', price: 425000, stock: 25 },
  { name: 'Tas Ransel Urban', description: 'Tas ransel waterproof kapasitas 25L', price: 275000, stock: 35 },
  { name: 'Jam Tangan Analog', description: 'Jam tangan analog kulit', price: 520000, stock: 20 },
  { name: 'Kacamata Hitam Polarized', description: 'Kacamata hitam UV400', price: 95000, stock: 60 },
  { name: 'Topi Baseball Classic', description: 'Topi baseball bahan cotton twill', price: 85000, stock: 80 },
  { name: 'Hoodie Cotton Fleece', description: 'Hoodie unisex cotton fleece', price: 210000, stock: 45 },
  { name: 'Sandal Kulit', description: 'Sandal kulit pria', price: 165000, stock: 55 },
] as const;

async function main() {
  const adminPassword = await bcrypt.hash('admin123', BCRYPT_SALT_ROUNDS);
  const userPassword = await bcrypt.hash('user123', BCRYPT_SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@solutech.dev' },
    update: {},
    create: {
      email: 'admin@solutech.dev',
      passwordHash: adminPassword,
      name: 'Administrator',
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@solutech.dev' },
    update: {},
    create: {
      email: 'user@solutech.dev',
      passwordHash: userPassword,
      name: 'Regular User',
      role: UserRole.USER,
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name },
      update: {},
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

> Catatan: seed `upsert where: { id: name }` tidak valid karena id adalah cuid. Perbaiki: gunakan `findFirst`/delete-then-create, atau set field `id` unik. Solusi aman: sebelum seed, hapus semua product lalu insert ulang. Sesuaikan saat implementasi agar idempoten.

- [ ] **Step 3: Jalankan seed & verifikasi**

```bash
pnpm db:seed
```

Expected: 2 user + 10 produk di database.

- [ ] **Step 4: Commit**

```bash
git add src/libs/db prisma/seed.ts
git commit -m "feat: add prisma client singleton and seed data"
```

---

### Task 3: JWT + password + guard auth

**Files:**
- Create: `src/libs/auth/jwt.ts`
- Create: `src/libs/auth/password.ts`
- Create: `src/libs/auth/guard.ts`
- Modify: `src/libs/env.ts` (tambah JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS, DATABASE_URL)

**Interfaces:**
- Produces:
  - `signJwt(payload: JwtPayload): Promise<string>` — payload `{ userId, email, role }`
  - `verifyJwt(token: string): Promise<JwtPayload>` — throws AppError.unauthorized bila invalid/expired
  - `hashPassword(plain: string): Promise<string>`
  - `verifyPassword(plain: string, hash: string): Promise<boolean>`
  - `getAuthUser(): Promise<JwtPayload>` — baca Bearer header dulu, fallback ke session cookie; throw 401 bila tidak ada/invalid
  - `requireAuth(): Promise<JwtPayload>` — alias getAuthUser

- [ ] **Step 1: Update `src/libs/env.ts`**

```ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const ENV = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1).default('1h'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
    SESSION_SECRET: z.string().min(1).optional().default('secret'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});
```

- [ ] **Step 2: Buat `src/libs/auth/jwt.ts`**

```ts
import { SignJWT, jwtVerify } from 'jose';
import { headers } from 'next/headers';

import { ENV } from '@/libs/env';
import { getSession } from '@/libs/session';
import { AppError } from '@/libs/utils';

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const secretKey = new TextEncoder().encode(ENV.JWT_SECRET);

export const signJwt = async (payload: JwtPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ENV.JWT_EXPIRES_IN)
    .sign(secretKey);
};

export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (!payload.userId || !payload.email || !payload.role) {
      throw AppError.unauthorized();
    }
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    throw AppError.unauthorized();
  }
};

export const getAuthUser = async (): Promise<JwtPayload> => {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  let token: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    const session = await getSession();
    token = session.token ?? null;
  }

  if (!token) throw AppError.unauthorized();
  return verifyJwt(token);
};

export const requireAuth = getAuthUser;
```

> Catatan: `getAuthUser` dipakai dari route handler (membaca request headers) dan dari server service. Server action `'use server'` bisa memakai `headers()` juga. Untuk route handler lebih tepat membaca dari `request.headers`; namun `headers()` dari next/headers juga bekerja di route handler. Alternatif yang lebih bersih: route handler memanggil `requireAuth()` yang memakai `headers()`. OK untuk project ini.

- [ ] **Step 3: Buat `src/libs/auth/password.ts`**

```ts
import bcrypt from 'bcryptjs';

import { ENV } from '@/libs/env';

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);
};

export const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
```

- [ ] **Step 4: Tambah barrel `src/libs/auth/index.ts`**

```ts
export * from './guard';
export * from './jwt';
export * from './password';
```

- [ ] **Step 5: Verifikasi typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/libs/auth src/libs/env.ts
git commit -m "feat: add jwt password and auth guard libs"
```

---

### Task 4: Error response + ApiResponse helper + logger (winston) + rate limit

**Files:**
- Create: `src/libs/logger/winston.ts`
- Create: `src/libs/rate-limit/index.ts`
- Create: `src/libs/api/server/response.ts`

**Interfaces:**
- Produces:
  - `logger` (winston instance: console transport + optional file)
  - `getRequestId()` / `createRequestId()`
  - `successResponse<T>(data, message?, status?)` → `NextResponse` JSON envelope
  - `errorResponse(status, message, errors?)` → `NextResponse` JSON envelope
  - `toApiResponse` / `withApiHandler` HOF yang wrap route handler + error mapping + logging
  - `RateLimiter` class: `limiter.check(ip): boolean` (sliding window in-memory)

- [ ] **Step 1: Buat `src/libs/logger/winston.ts`**

```ts
import winston from 'winston';

const { combine, timestamp, json, printf, colorize, align } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp: ts, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${ts} [${level}]: ${message} ${metaStr}`;
  }),
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? json() : consoleFormat,
    }),
  ],
});
```

> Catatan: transport file `logs/app.log` & `logs/error.log` bersifat opsional (nilai tambah). Untuk kesederhanaan & grading lokal, console transport cukup. Tambahkan transport file bila diinginkan.

- [ ] **Step 2: Buat `src/libs/rate-limit/index.ts`**

```ts
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
}

export const loginRateLimiter = new RateLimiter(15 * 60 * 1000, 5);
```

> Catatan: in-memory — hanya untuk single-instance dev. Untuk multi-instance production gunakan Redis. Dicatat di README sebagai keputusan teknis.

- [ ] **Step 3: Buat `src/libs/api/server/response.ts`**

```ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

import { HTTP_STATUS } from '@/libs/constants';
import type { ApiResponse } from '@/types';

type ApiResult = {
  status: number;
  message: string;
  data?: unknown;
  errors?: unknown[];
};

export const successResponse = <T>(
  data: T,
  message = 'Success',
  status = HTTP_STATUS.OK,
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json<ApiResponse<T>>(
    {
      status,
      success: true,
      message,
      data,
      errors: [],
      trace_id: randomUUID(),
    },
    { status },
  );
};

export const errorResponse = (
  status: number,
  message: string,
  errors: unknown[] = [],
): NextResponse<ApiResponse<null>> => {
  return NextResponse.json<ApiResponse<null>>(
    {
      status,
      success: false,
      message,
      data: null,
      errors,
      trace_id: randomUUID(),
    },
    { status },
  );
};
```

> Catatan: `src/libs/api/server/error.ts` (normalizeApiResponse) tetap ada. Kita buat `response.ts` untuk NextResponse-based helper agar route handler konsisten. Pastikan tidak konflik barrel.

- [ ] **Step 4: Update barrel `src/libs/api/server/index.ts`**

```ts
export * from './error';
export * from './local';
export * from './response';
```

- [ ] **Step 5: Verifikasi typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/libs/logger src/libs/rate-limit src/libs/api/server/response.ts src/libs/api/server/index.ts
git commit -m "feat: add logger rate limiter and response helpers"
```

---

### Task 5: Auth module backend (login route + auth service)

**Files:**
- Modify: `src/modules/auth/validations/auth.validation.ts` (tambah field email/password, hapus `user`)
- Modify: `src/modules/auth/types/auth.types.ts` (LoginResponse: access_token + user)
- Modify: `src/modules/auth/services/server/auth.service.ts` (login via Prisma + jose)
- Create: `src/modules/auth/repositories/user.repository.ts`
- Modify: `src/modules/auth/actions/auth.action.ts` (loginAction pakai user dari response)
- Create: `src/app/api/auth/login/route.ts`
- Modify: `src/libs/session.ts` (redirectTo default '/products')

**Interfaces:**
- Produces:
  - `userRepository.findByEmail(email)`, `userRepository.findById(id)` — return Prisma User atau null
  - `authServerService.login(dto)` → `ApiResponse<LoginResponse>`
  - `POST /api/auth/login` → 200 `{ access_token, user, expires_in }` + set cookie
  - `LoginResponse = { access_token: string; user: UserResponse; expires_in: number }`

- [ ] **Step 1: Buat `src/modules/auth/repositories/user.repository.ts`**

```ts
import type { User } from '@prisma/client';

import { prisma } from '@/libs/db';

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
  findById: (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },
  create: (data: Pick<User, 'email' | 'passwordHash' | 'name' | 'role'>) => {
    return prisma.user.create({ data });
  },
};
```

> Tambah `src/modules/auth/repositories/index.ts` barrel `export * from './user.repository';`

- [ ] **Step 2: Update `src/modules/auth/validations/auth.validation.ts`**

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  callbackUrl: z.string().optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
```

- [ ] **Step 3: Update `src/modules/auth/types/auth.types.ts`**

```ts
import type { UserRole } from '@prisma/client';

export type LoginResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  expires_in: number;
};
```

- [ ] **Step 4: Rewrite `src/modules/auth/services/server/auth.service.ts`**

```ts
import 'server-only';

import { verifyPassword } from '@/libs/auth';
import { signJwt } from '@/libs/auth';
import { ENV } from '@/libs/env';
import { AppError } from '@/libs/utils';
import type { ApiResponse } from '@/types';

import type { LoginResponse } from '../../types';
import type { LoginDto } from '../../validations';
import { userRepository } from '../../repositories';

export const authServerService = {
  login: async (dto: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    try {
      const user = await userRepository.findByEmail(dto.email);
      if (!user) throw AppError.unauthorized('Invalid email or password');

      const isValid = await verifyPassword(dto.password, user.passwordHash);
      if (!isValid) throw AppError.unauthorized('Invalid email or password');

      const token = await signJwt({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        status: 200,
        success: true,
        message: 'Login successful',
        data: {
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          expires_in: ENV.JWT_EXPIRES_IN,
        },
        errors: [],
        trace_id: '',
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          status: error.status,
          success: false,
          message: error.message,
          data: null as unknown as LoginResponse,
          errors: error.errors,
          trace_id: '',
        };
      }
      throw error;
    }
  },
};
```

> Catatan: layanan mengembalikan `ApiResponse` karena dipakai server action FE (pola existing `callService`). Route handler juga memakainya. Konsekuensi: error internal dibiarkan throw dan di-map oleh `withApiHandler`/route handler. Perbaiki saat implementasi agar konsisten: sebaiknya service THROW AppError, dan route handler + action yang mengubah ke ApiResponse. Ikuti pola: service throw, `loginAction` tangkap jadi ActionState, route handler tangkap jadi envelope.

- [ ] **Step 5: Buat `src/app/api/auth/login/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { loginRateLimiter } from '@/libs/rate-limit';
import { successResponse, errorResponse } from '@/libs/api/server';
import { AppError } from '@/libs/utils';
import { loginSchema } from '@/modules/auth/validations';
import { authServerService } from '@/modules/auth/services/server';

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!loginRateLimiter.check(ip)) {
    return errorResponse(429, 'Too many login attempts. Please try again later.');
  }

  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }

    const result = await authServerService.login(parsed.data);

    if (!result.success) {
      return errorResponse(result.status, result.message, result.errors);
    }

    const response = successResponse(result.data, result.message, 200);
    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[login]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}
```

> Catatan: cookie FE di-set oleh `loginAction` (server action) via `setSession`, bukan di route handler — konsisten dengan arsitektur existing (FE menggunakan iron-session). Postman memakai `access_token` dari body.

- [ ] **Step 6: Update `src/modules/auth/actions/auth.action.ts`**

```ts
'use server';

import { redirect } from 'next/navigation';

import { setSession } from '@/libs/session';
import type { ActionState } from '@/types';

import { authServerService } from '../services/server';
import type { LoginResponse } from '../types';
import type { LoginDto } from '../validations';

export const loginAction = async (
  _: ActionState<LoginResponse>,
  dto: LoginDto,
): Promise<ActionState<LoginResponse>> => {
  const { callbackUrl, ...data } = dto;

  const result = await authServerService.login(data);
  if (!result.success) return result;

  await setSession(result.data.access_token, callbackUrl ?? '/products');
  redirect(callbackUrl ?? '/products');
};
```

- [ ] **Step 7: Update LoginForm** — ganti field `user` → `email` (label Email)

`src/modules/auth/components/LoginForm.tsx`: field name `user` → `email`, placeholder "Enter Email", label "Email".

- [ ] **Step 8: Verifikasi**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/modules/auth src/app/api/auth/login/route.ts
git commit -m "feat: implement local login with prisma and jwt"
```

---

### Task 6: Product module — repository + service + validations + types

**Files:**
- Create: `src/modules/product/repositories/product.repository.ts`
- Create: `src/modules/product/services/server/product.service.ts`
- Create: `src/modules/product/validations/product.validation.ts`
- Create: `src/modules/product/types/product.types.ts`

**Interfaces:**
- Produces:
  - `productRepository.findMany(params: { page, limit, search })`, `productRepository.count(search)`, `productRepository.findActiveById(id)`, `productRepository.create(data)`, `productRepository.update(id, data)`, `productRepository.softDelete(id)`
  - `productService.getList(params)`, `productService.getById(id)`, `productService.create(dto)`, `productService.update(id, dto)`, `productService.softDelete(id)`
  - Validation: `productCreateSchema`, `productUpdateSchema`, `productQuerySchema`
  - Types: `ProductResponse`, `ProductListResponse`, `ProductListDto`

- [ ] **Step 1: Buat `src/modules/product/validations/product.validation.ts`**

```ts
import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().default(''),
});

export type ProductCreateDto = z.infer<typeof productCreateSchema>;
export type ProductUpdateDto = z.infer<typeof productUpdateSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;
```

> Tambah `index.ts` barrel.

- [ ] **Step 2: Buat `src/modules/product/types/product.types.ts`**

```ts
export type ProductResponse = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  created_at: string;
  updated_at: string;
};
```

> Tambah barrel `index.ts`.

- [ ] **Step 3: Buat `src/modules/product/repositories/product.repository.ts`**

```ts
import type { Prisma } from '@prisma/client';

import { prisma } from '@/libs/db';

type ListParams = {
  page: number;
  limit: number;
  search: string;
};

const buildWhere = (search: string): Prisma.ProductWhereInput => ({
  deletedAt: null,
  ...(search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : {}),
});

export const productRepository = {
  findMany: async ({ page, limit, search }: ListParams) => {
    const skip = (page - 1) * limit;
    return prisma.product.findMany({
      where: buildWhere(search),
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  },
  count: (search: string) => {
    return prisma.product.count({ where: buildWhere(search) });
  },
  findActiveById: (id: string) => {
    return prisma.product.findFirst({ where: { id, deletedAt: null } });
  },
  create: (data: Prisma.ProductCreateInput) => {
    return prisma.product.create({ data });
  },
  update: (id: string, data: Prisma.ProductUpdateInput) => {
    return prisma.product.update({ where: { id }, data });
  },
  softDelete: (id: string) => {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
```

> Tambah barrel `index.ts`.

- [ ] **Step 4: Buat `src/modules/product/services/server/product.service.ts`**

```ts
import 'server-only';

import { AppError } from '@/libs/utils';

import type { ProductQueryDto, ProductCreateDto, ProductUpdateDto } from '../../validations';
import type { ProductResponse } from '../../types';
import { productRepository } from '../../repositories';

const toResponse = (product: {
  id: string;
  name: string;
  description: string | null;
  price: unknown;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}): ProductResponse => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: String(product.price),
  stock: product.stock,
  created_at: product.createdAt.toISOString(),
  updated_at: product.updatedAt.toISOString(),
});

export const productService = {
  getList: async (query: ProductQueryDto) => {
    const [items, total] = await Promise.all([
      productRepository.findMany(query),
      productRepository.count(query.search),
    ]);

    return {
      items: items.map(toResponse),
      meta: {
        page: query.page,
        total_data: total,
        total_pages: Math.ceil(total / query.limit),
        total_per_page: query.limit,
      },
    };
  },
  getById: async (id: string): Promise<ProductResponse> => {
    const product = await productRepository.findActiveById(id);
    if (!product) throw AppError.notFound('Product not found');
    return toResponse(product);
  },
  create: async (dto: ProductCreateDto): Promise<ProductResponse> => {
    const product = await productRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
    });
    return toResponse(product);
  },
  update: async (id: string, dto: ProductUpdateDto): Promise<ProductResponse> => {
    await productService.getById(id);
    const product = await productRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description ?? null }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
    });
    return toResponse(product);
  },
  softDelete: async (id: string): Promise<void> => {
    await productService.getById(id);
    await productRepository.softDelete(id);
  },
};
```

> Perlu tambah `AppError.notFound` static factory di `src/libs/utils/errors.ts`.

- [ ] **Step 5: Tambah `notFound` di `src/libs/utils/errors.ts`**

```ts
static notFound(message: string = 'Not found') {
  return new AppError(HTTP_STATUS.NOT_FOUND, message);
}
```

- [ ] **Step 6: Verifikasi**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/modules/product src/libs/utils/errors.ts
git commit -m "feat: add product repository service validation types"
```

---

### Task 7: Product API routes

**Files:**
- Create: `src/app/api/products/route.ts`
- Create: `src/app/api/products/[id]/route.ts`

**Interfaces:**
- Consumes: `productService`, `requireAuth`, `successResponse/errorResponse`, zod schemas.
- Produces:
  - `GET /api/products?page=&limit=&search=` → 200 `{ items, meta }`
  - `POST /api/products` → 201 product
  - `GET /api/products/:id` → 200 product / 404
  - `PATCH /api/products/:id` → 200 product
  - `DELETE /api/products/:id` → 200 `{ id }` (soft delete)

- [ ] **Step 1: Buat `src/app/api/products/route.ts`**

```ts
import { NextResponse } from 'next/server';

import { errorResponse, successResponse } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import { productService } from '@/modules/product/services/server';
import { productCreateSchema, productQuerySchema } from '@/modules/product/validations';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const parsed = productQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    });
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }
    const data = await productService.getList(parsed.data);
    return successResponse(data, 'Products fetched successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[products:GET]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json().catch(() => null);
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }
    const data = await productService.create(parsed.data);
    return successResponse(data, 'Product created successfully', 201);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[products:POST]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}
```

> Catatan: untuk mengurangi duplikasi try/catch, buat helper `withApiHandler` yang wrap. Implementasikan di Task 9 (sebagai refactor ringan). Untuk kejelasan plan, route handler ditulis eksplisit dulu.

- [ ] **Step 2: Buat `src/app/api/products/[id]/route.ts`**

```ts
import type { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import { productService } from '@/modules/product/services/server';
import { productUpdateSchema } from '@/modules/product/validations';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const data = await productService.getById(id);
    return successResponse(data, 'Product fetched successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[products:id:GET]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }
    const data = await productService.update(id, parsed.data);
    return successResponse(data, 'Product updated successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[products:id:PATCH]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    await productService.softDelete(id);
    return successResponse({ id }, 'Product deleted successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[products:id:DELETE]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}
```

- [ ] **Step 3: Verifikasi build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/products
git commit -m "feat: add product api routes"
```

---

### Task 8: Order module — repository + service + transaction + routes

**Files:**
- Create: `src/modules/order/repositories/order.repository.ts`
- Create: `src/modules/order/services/server/order.service.ts`
- Create: `src/modules/order/validations/order.validation.ts`
- Create: `src/modules/order/types/order.types.ts`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/orders/[id]/route.ts`

**Interfaces:**
- Produces:
  - `orderValidation: orderCreateSchema` — `{ items: [{ productId, quantity }] }`
  - `orderService.create(userId, dto)` — transaction: cek stok, decrement, buat order + items, hitung total
  - `orderService.getList(userId, query)` — pagination, filter by userId
  - `orderService.getById(userId, id)` — hanya order milik user
  - Routes: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`

- [ ] **Step 1: Buat `src/modules/order/validations/order.validation.ts`**

```ts
import { z } from 'zod';

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.coerce.number().int().positive('Quantity must be positive'),
      }),
    )
    .min(1, 'Order must have at least one item'),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type OrderCreateDto = z.infer<typeof orderCreateSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
```

- [ ] **Step 2: Buat `src/modules/order/types/order.types.ts`**

```ts
import type { OrderStatus } from '@prisma/client';

export type OrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

export type OrderResponse = {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: string;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
};
```

- [ ] **Step 3: Buat `src/modules/order/repositories/order.repository.ts`**

```ts
import type { Prisma } from '@prisma/client';

import { prisma } from '@/libs/db';

type ListParams = { userId: string; page: number; limit: number };

export const orderRepository = {
  findManyByUser: ({ userId, page, limit }: ListParams) => {
    const skip = (page - 1) * limit;
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { items: true },
    });
  },
  countByUser: (userId: string) => {
    return prisma.order.count({ where: { userId } });
  },
  findByIdForUser: (userId: string, id: string) => {
    return prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
  },
  findProductById: (productId: string) => {
    return prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
      select: { id: true, name: true, price: true, stock: true },
    });
  },
  decrementStock: (productId: string, quantity: number): Prisma.PrismaPromise<Prisma.BatchPayload> => {
    return prisma.product.updateMany({
      where: { id: productId, stock: { gte: quantity }, deletedAt: null },
      data: { stock: { decrement: quantity } },
    });
  },
  createWithItems: (
    userId: string,
    totalPrice: number,
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[],
  ) => {
    return prisma.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  },
};
```

- [ ] **Step 4: Buat `src/modules/order/services/server/order.service.ts`**

```ts
import 'server-only';

import { prisma } from '@/libs/db';
import { AppError } from '@/libs/utils';

import type { OrderQueryDto, OrderCreateDto } from '../../validations';
import type { OrderResponse } from '../../types';
import { orderRepository } from '../../repositories';

const toResponse = (order: any): OrderResponse => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  totalPrice: String(order.totalPrice),
  created_at: order.createdAt.toISOString(),
  updated_at: order.updatedAt.toISOString(),
  items: (order.items ?? []).map((item: any) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: String(item.unitPrice),
    subtotal: String(item.subtotal),
  })),
});

export const orderService = {
  create: async (userId: string, dto: OrderCreateDto): Promise<OrderResponse> => {
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, deletedAt: null },
          select: { id: true, name: true, price: true, stock: true },
        });
        if (!product) {
          throw AppError.notFound(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw AppError.conflict(`Insufficient stock for product: ${product.name}`);
        }

        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw AppError.conflict(`Insufficient stock for product: ${product.name}`);
        }

        const unitPrice = Number(product.price);
        totalPrice += unitPrice * item.quantity;
        items.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
        });
      }

      return tx.order.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });
    });

    return toResponse(order);
  },
  getList: async (userId: string, query: OrderQueryDto) => {
    const [items, total] = await Promise.all([
      orderRepository.findManyByUser({ userId, page: query.page, limit: query.limit }),
      orderRepository.countByUser(userId),
    ]);

    return {
      items: items.map(toResponse),
      meta: {
        page: query.page,
        total_data: total,
        total_pages: Math.ceil(total / query.limit),
        total_per_page: query.limit,
      },
    };
  },
  getById: async (userId: string, id: string): Promise<OrderResponse> => {
    const order = await orderRepository.findByIdForUser(userId, id);
    if (!order) throw AppError.notFound('Order not found');
    return toResponse(order);
  },
};
```

> Catatan: penggunaan `any` di `toResponse` melanggar aturan no-`any`. Ganti dengan tipe dari Prisma `Prisma.OrderGetPayload<{ include: { items: true } }>`. Perbaiki saat implementasi.

- [ ] **Step 5: Tambah `conflict` static factory di errors.ts**

```ts
static conflict(message: string = 'Conflict') {
  return new AppError(HTTP_STATUS.CONFLICT, message);
}
```

- [ ] **Step 6: Buat `src/app/api/orders/route.ts`**

```ts
import type { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import { orderService } from '@/modules/order/services/server';
import { orderCreateSchema, orderQuerySchema } from '@/modules/order/validations';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const body = await request.json().catch(() => null);
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }
    const data = await orderService.create(authUser.userId, parsed.data);
    return successResponse(data, 'Order created successfully', 201);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[orders:POST]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const parsed = orderQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });
    if (!parsed.success) {
      return errorResponse(400, 'Validation failed', parsed.error.flatten().fieldErrors);
    }
    const data = await orderService.getList(authUser.userId, parsed.data);
    return successResponse(data, 'Orders fetched successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[orders:GET]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}
```

- [ ] **Step 7: Buat `src/app/api/orders/[id]/route.ts`**

```ts
import type { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import { orderService } from '@/modules/order/services/server';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuth();
    const { id } = await params;
    const data = await orderService.getById(authUser.userId, id);
    return successResponse(data, 'Order fetched successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.status, error.message, error.errors);
    }
    console.error('[orders:id:GET]', error);
    return errorResponse(500, 'An unexpected error occurred');
  }
}
```

- [ ] **Step 8: Verifikasi**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/modules/order src/app/api/orders src/libs/utils/errors.ts
git commit -m "feat: add order module with transactional creation"
```

---

### Task 9: withApiHandler HOF (refactor route handlers)

**Files:**
- Create: `src/libs/api/server/with-handler.ts`
- Modify: semua route handler (auth/products/orders) untuk memakai `withApiHandler`

**Interfaces:**
- Produces: `withApiHandler(handler)` → wrap, map AppError/ZodError/unknown → envelope + logging via winston.

- [ ] **Step 1: Buat `src/libs/api/server/with-handler.ts`**

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from '@/libs/logger';
import { AppError } from '@/libs/utils';

import { errorResponse, successResponse } from './response';

type HandlerContext = { params: Promise<Record<string, string | string[] | undefined>> };

type Handler<C> = (req: Request, ctx: C) => Promise<NextResponse>;

export const withApiHandler = <C extends HandlerContext = HandlerContext>(
  handler: Handler<C>,
): Handler<C> => {
  return async (req, ctx) => {
    const startedAt = Date.now();
    const method = req.method;
    const url = req.url;

    try {
      const response = await handler(req, ctx);
      logger.info('api request', {
        method,
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return response;
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn('api error', {
          method,
          url,
          status: error.status,
          message: error.message,
          durationMs: Date.now() - startedAt,
        });
        return errorResponse(error.status, error.message, error.errors);
      }

      if (error instanceof z.ZodError) {
        logger.warn('validation error', {
          method,
          url,
          errors: error.flatten().fieldErrors,
          durationMs: Date.now() - startedAt,
        });
        return errorResponse(400, 'Validation failed', error.flatten().fieldErrors);
      }

      logger.error('unhandled error', {
        method,
        url,
        error: error instanceof Error ? error.stack : String(error),
        durationMs: Date.now() - startedAt,
      });
      return errorResponse(500, 'An unexpected error occurred');
    }
  };
};
```

> Catatan: barrel `successResponse` tidak dipakai di helper ini langsung; hapus import yang tidak perlu saat implementasi.

- [ ] **Step 2: Refactor route handlers** untuk memakai `withApiHandler` dan `throw` (bukan return envelope). Contoh `products/route.ts`:

```ts
import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { productService } from '@/modules/product/services/server';
import { productCreateSchema, productQuerySchema } from '@/modules/product/validations';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth();
  const searchParams = request.nextUrl.searchParams;
  const parsed = productQuerySchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
  });
  const data = await productService.getList(parsed);
  return successResponse(data, 'Products fetched successfully');
});

export const POST = withApiHandler(async (request: NextRequest) => {
  await requireAuth();
  const body = await request.json();
  const parsed = productCreateSchema.parse(body);
  const data = await productService.create(parsed);
  return successResponse(data, 'Product created successfully', 201);
});
```

> Refactor serupa untuk `[id]`, orders, dan login. login tetap pakai rate limit manual + withApiHandler.

- [ ] **Step 3: Verifikasi**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/libs/api/server/with-handler.ts src/app/api
git commit -m "refactor: use withApiHandler for consistent error handling and logging"
```

---

### Task 10: FE Admin — Product management (nilai tambah)

**Files:**
- Create: `src/modules/product/services/client/product.service.ts`
- Create: `src/modules/product/hooks/useProducts.tsx`
- Create: `src/modules/product/actions/product.action.ts`
- Create: `src/modules/product/constants/routes.ts`, `constants/header.ts`, `constants/columns.tsx`
- Create: `src/modules/product/components/ProductsTable.tsx`, `ProductsHeader.tsx`, `ProductForm.tsx`
- Create: `src/modules/product/views/ProductView.tsx`, `ProductCreateView.tsx`, `ProductEditView.tsx`
- Create: `src/app/(admin)/products/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`
- Modify: `src/modules/product/index.ts`

**Interfaces:**
- Produces:
  - `productClientService.getList(dto)` → `PaginatedResponse<ProductListResponse>` via `fetch('/api/products?...')`
  - `useProducts(dto)` → React Query
  - `productCreateAction`, `productUpdateAction`, `productDeleteAction` (server actions)
  - Pages `/products`, `/products/new`, `/products/[id]/edit`

- [ ] **Step 1: Buat `src/modules/product/services/client/product.service.ts`**

```ts
'use client';

import type { Paginated, PaginatedResponse } from '@/types';

import type { ProductResponse } from '../../types';
import type { ProductQueryDto } from '../../validations';

export const productClientService = {
  getList: async (dto: ProductQueryDto): Promise<PaginatedResponse<ProductResponse>> => {
    const params = new URLSearchParams({
      page: String(dto.page),
      limit: String(dto.limit),
      search: dto.search,
    });
    const response = await fetch(`/api/products?${params.toString()}`, {
      cache: 'no-store',
    });
    return response.json();
  },
};
```

> Catatan: FE list memakai `fetch` langsung ke route handler (React Query untuk client-side read, sesuai AGENTS.md). Untuk mutation, pakai Server Actions.

- [ ] **Step 2: Buat `src/modules/product/hooks/useProducts.tsx`**

```ts
import { useQuery } from '@tanstack/react-query';

import { productClientService } from '../services/client';
import type { ProductQueryDto } from '../validations';

export const PRODUCT_KEY = 'products';

export const useProducts = (dto: ProductQueryDto) => {
  return useQuery({
    queryKey: [PRODUCT_KEY, dto],
    queryFn: () => productClientService.getList(dto),
    select: (response) => response.data,
  });
};
```

- [ ] **Step 3: Buat `src/modules/product/actions/product.action.ts`**

```ts
'use server';

import { requireAuth } from '@/libs/auth';
import type { ActionState } from '@/types';

import { productService } from '../services/server';
import type { ProductCreateDto, ProductUpdateDto } from '../validations';

export const productCreateAction = async (_: ActionState, dto: ProductCreateDto) => {
  try {
    await requireAuth();
    const data = await productService.create(dto);
    return { status: 201, success: true, message: 'Product created successfully', data, errors: [], trace_id: '' };
  } catch (error) {
    return { status: 400, success: false, message: error instanceof Error ? error.message : 'Failed', data: null, errors: [], trace_id: '' };
  }
};

export const productUpdateAction = async (_: ActionState, dto: ProductUpdateDto & { id: string }) => {
  try {
    await requireAuth();
    const { id, ...rest } = dto;
    const data = await productService.update(id, rest);
    return { status: 200, success: true, message: 'Product updated successfully', data, errors: [], trace_id: '' };
  } catch (error) {
    return { status: 400, success: false, message: error instanceof Error ? error.message : 'Failed', data: null, errors: [], trace_id: '' };
  }
};

export const productDeleteAction = async (_: ActionState, id: string) => {
  try {
    await requireAuth();
    await productService.softDelete(id);
    return { status: 200, success: true, message: 'Product deleted successfully', data: { id }, errors: [], trace_id: '' };
  } catch (error) {
    return { status: 400, success: false, message: error instanceof Error ? error.message : 'Failed', data: null, errors: [], trace_id: '' };
  }
};
```

- [ ] **Step 4: Buat components & views FE** (ProductsTable, ProductsHeader, ProductForm, ProductView, CreateView, EditView) mengikuti pola `docs/reference/module-pattern.md` dan komponen UI existing (Table, TableContainer, TableHead, TableData, Pagination, Button, FormField/Input).

- [ ] **Step 5: Buat halaman**

`src/app/(admin)/products/page.tsx`:
```tsx
import { ProductViewPage } from '@/modules/product';

export default async function ProductsPage() {
  return <ProductViewPage />;
}
```

- [ ] **Step 6: Verifikasi**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/modules/product src/app/\(admin\)/products
git commit -m "feat: add product management frontend"
```

---

> Catatan: FE Order TIDAK dikerjakan — tidak wajib dalam test (nilai tambah hanya contoh "management product"). Scope FE dibatasi ke Product saja. Admin layout tetap memakai placeholder user sementara (Task 10) sampai login berfungsi.

### Task 12: Deliverables — Postman collection, SQL file, README

**Files:**
- Create: `docs/postman/solutech.postman_collection.json`
- Modify: `README.md` (rewrite: setup, .env, docker, SQL, seed, keputusan teknis, daftar fitur, estimasi)
- Modify: `.env.example` (final)
- Modify: `docs/Technical Test Backend Developer Solutech.md` (tetap, tidak diubah)

- [ ] **Step 1: Buat Postman collection JSON** — environment variable `{{baseUrl}}` = `http://localhost:3000`, `{{token}}`. Collection berisi: Login (dengan test script set token dari response), Products CRUD, Orders (create + list + detail), semuanya dengan contoh request & header Authorization Bearer {{token}}.

- [ ] **Step 2: Rewrite README.md** — ikuti struktur deliverables test: penjelasan project, setup (.env, docker db, SQL create table, seed), cara menjalankan, keputusan teknis & asumsi, fitur selesai/belum, estimasi waktu.

- [ ] **Step 3: Verifikasi build final**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/postman .env.example
git commit -m "docs: add postman collection and rewrite readme"
```

---

## Self-Review Notes

- **Tipe `any`:** Task 8 & 11 masih mengandung `any` di `toResponse` dan tipe `User`. WAJIB diganti dengan tipe Prisma generik saat implementasi (no-`any` rule).
- **Service return type:** service `login`/`create` mengembalikan `ApiResponse` (action-friendly) vs route handler. Keputusan final: **service THROW AppError**, route handler & server action mengubah menjadi envelope. Sesuaikan Task 5, 7, 8 saat implementasi.
- **`AppError` factories:** tambah `notFound` & `conflict` (sudah direncanakan).
- **GET params**: `productQuerySchema`/`orderQuerySchema` dipakai di route handler; untuk FE client service gunakan tipe DTO yang sama.
- **Spec coverage:** auth (T5), product CRUD (T6-7), order + transaction (T8), layered (semua), validation (semua), error handling (T4, T9), DB SQL + seed (T1-2), .env + README (T1, T12), Postman (T12), rate limit + logging (T4), FE admin (T10-11).
- **Placeholder check:** semua langkah punya kode atau arahan spesifik.

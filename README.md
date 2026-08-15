# Solutech E-Commerce API — Technical Test

REST API untuk modul inti toko online (e-commerce): **manajemen product** dan **pembuatan order**, dibangun dengan **Next.js (App Router)**, **Prisma**, dan **PostgreSQL**. Arsitektur berlapis: **route handler → service → repository**.

Dikerjakan sebagai Solutech Technical Test — Backend Developer. Frontend admin sederhana (management product) disertakan sebagai nilai tambah.

## ✨ Fitur

### Authentication (JWT)

- `POST /api/auth/register` — buat akun baru (role `USER`, status `ACTIVE`). Email duplikat → 409.
- `POST /api/auth/login` — login, mengembalikan **JWT** (dual-mode: Bearer token untuk Postman/API client, dan httpOnly cookie via iron-session untuk browser).
- Endpoint product & order dilindungi — wajib menyertakan token.
- Password di-hash dengan `bcryptjs`; JWT ditandatangani dengan `jose` (HS256).
- **Rate limiting** pada login (5 percobaan / 15 menit per IP) — otomatis memakai Redis bila tersedia, fallback ke in-memory.

### Product (CRUD + soft delete)

- `GET /api/products` — list dengan **pagination** + **search by nama** (case-insensitive), mengecualikan yang sudah di-soft-delete.
- `GET /api/products/:id` — detail (404 bila tidak ada/terhapus).
- `POST /api/products` — create.
- `PATCH /api/products/:id` — update (parsial).
- `DELETE /api/products/:id` — **soft delete** (set `deletedAt`).

### Order (transactional)

- `POST /api/orders` — create order: menerima daftar `{ productId, quantity }`, **mengurangi stok** dan **menghitung total harga di dalam satu database transaction** (`prisma.$transaction`). Menolak bila stok tidak cukup (409, anti-overselling) atau produk tidak ada (404).
- `GET /api/orders` — list order **milik user yang login saja** (dari JWT), pagination.
- `GET /api/orders/:id` — detail order milik user login saja (order milik user lain → 404).

### Kualitas

- Validasi Zod di **semua** endpoint.
- Error handling konsisten: response envelope `{ status, success, message, data, errors, trace_id }` dengan HTTP status yang sesuai (200/201/400/401/404/409/500).
- Request logging via **Winston** (method, URL, status, durasi).
- **Redis caching** untuk list product (TTL 60 detik) dengan invalidasi otomatis saat create/update/delete, dan **fallback aman** ke database bila Redis tidak tersedia.
- Layered architecture: route handler (`app/api/*`) → service (`src/services/`) → repository (`src/repositories/`) → Prisma, dengan validasi Zod terpusat di `src/validations/`.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Route Handlers, Server Actions)
- **ORM:** Prisma 7 + PostgreSQL 16
- **Cache:** Redis 7 (via `ioredis`)
- **Auth:** `jose` (JWT HS256), `bcryptjs`
- **Validation:** Zod 4
- **Logging:** Winston
- **UI (bonus):** React 19, Tailwind CSS 4, TanStack Query 5, React Hook Form
- **Tooling:** TypeScript, ESLint, Prettier, Husky/Commitlint

---

## 📦 Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 10.12.0
- **Docker** (untuk menjalankan PostgreSQL & Redis, opsional — bisa pakai layanan lokal)
- **PostgreSQL** 16
- **Redis** 7 (opsional — aplikasi tetap berjalan tanpa Redis, hanya tanpa cache)

---

## 🛠️ Setup & Menjalankan di Local

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Salin `.env.example` menjadi `.env` dan sesuaikan nilainya:

```bash
cp .env.example .env
```

**Penjelasan variabel:**

| Variabel             | Deskripsi                                                                                        | Contoh   |
| -------------------- | ------------------------------------------------------------------------------------------------ | -------- |
| `APP_PORT`           | Port aplikasi Next.js                                                                            | `3000`   |
| `DATABASE_URL`       | Koneksi PostgreSQL (lihat contoh di bawah)                                                       | —        |
| `JWT_SECRET`         | Secret untuk menandatangani JWT (min 32 char di production; generate: `openssl rand -base64 48`) | `secret` |
| `JWT_EXPIRES_IN`     | Masa berlaku token                                                                               | `1h`     |
| `BCRYPT_SALT_ROUNDS` | Salt rounds bcrypt                                                                               | `10`     |
| `SESSION_SECRET`     | Secret iron-session untuk cookie FE (min 32 char; generate: `openssl rand -base64 24`)           | `secret` |
| `REDIS_URL`          | Koneksi Redis (opsional). Cache & rate limit otomatis memakainya bila tersedia; fallback ke memory bila tidak. | `redis://localhost:6379` |

Contoh `DATABASE_URL`:

```bash
DATABASE_URL=postgresql://solutech:solutech@localhost:5432/db_solutech?schema=public
```

### 3. Infrastruktur — Database & Redis

**Opsi A — Docker (disarankan):**

```bash
docker compose up -d db redis
```

**Opsi B — PostgreSQL & Redis lokal:**

Buat database `db_solutech` & user `solutech` (atau sesuaikan `DATABASE_URL` di `.env`), dan pastikan Redis berjalan di `REDIS_URL`. Redis bersifat opsional — tanpa Redis, aplikasi tetap berjalan (hanya tanpa caching).

### 4. Buat tabel + jalankan seed

Dua cara yang setara:

**Cara 1 — Command SQL create table (sesuai requirement deliverable):**

```bash
# 1. Jalankan file SQL untuk membuat tabel (postgresql://... atau psql)
psql "$DATABASE_URL" -f prisma/create_tables.sql

# 2. Generate Prisma Client (wajib setelah schema berubah)
pnpm db:generate

# 3. Seed data awal
pnpm db:seed
```

**Cara 2 — Prisma Migrate (alternatif, lebih cepat untuk dev):**

```bash
pnpm db:generate
pnpm db:migrate      # prisma migrate dev
pnpm db:seed
```

> File SQL `prisma/create_tables.sql` berisi perintah `CREATE TABLE` lengkap (termasuk enum), dibuat langsung dari `schema.prisma` — selalu sinkron dengan model.

### 5. Jalankan aplikasi

```bash
pnpm dev              # development (http://localhost:3000)
# atau
pnpm build && pnpm start   # production
```

**Kredensial seed:**

| Role  | Email                | Password   |
| ----- | -------------------- | ---------- |
| Admin | `admin@solutech.dev` | `admin123` |
| User  | `user@solutech.dev`  | `user123`  |

> Kedua role dapat login & mengakses seluruh API (product & order, order di-filter per-user). Halaman FE admin (management product) dikhususkan untuk role **ADMIN** — user biasa akan melihat halaman *Forbidden*.

---

## 🔐 Pengujian via Postman

1. Import `docs/postman/solutech.postman_collection.json`.
2. Set variable `baseUrl` (default sudah `http://localhost:3000`).
3. Jalankan **Auth → Login**. Token otomatis tersimpan ke variable `token` (via test script).
4. Endpoint protected otomatis memakai `Authorization: Bearer {{token}}`.

Flow yang disarankan: Login → List Products → Create Product → Create Order → List My Orders → Get Order Detail.

Contoh request langsung (curl):

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@solutech.dev","password":"admin123"}'

# List products (dengan token dari response login)
curl "http://localhost:3000/api/products?page=1&limit=10&search=" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"items":[{"productId":"<PRODUCT_ID>","quantity":2}]}'
```

---

## 📡 API Reference

Response envelope (semua endpoint):

```json
{
  "status": 200,
  "success": true,
  "message": "Success",
  "data": {},
  "errors": [],
  "trace_id": "uuid"
}
```

| Method | Path                                 | Auth              | Deskripsi                          |
| ------ | ------------------------------------ | ----------------- | ---------------------------------- |
| POST   | `/api/auth/register`                 | ❌                 | Register → buat akun (role USER)   |
| POST   | `/api/auth/login`                    | ❌ (rate-limited) | Login → JWT + user                 |
| POST   | `/api/auth/logout`                   | ❌                | Logout (hapus cookie)              |
| GET    | `/api/products?page=&limit=&search=` | ✅                | List product (pagination + search) |
| GET    | `/api/products/:id`                  | ✅                | Detail product                     |
| POST   | `/api/products`                      | ✅                | Create product                     |
| PATCH  | `/api/products/:id`                  | ✅                | Update product                     |
| DELETE | `/api/products/:id`                  | ✅                | Soft delete product                |
| POST   | `/api/orders`                        | ✅                | Create order (transactional)       |
| GET    | `/api/orders?page=&limit=`           | ✅                | List order milik user login        |
| GET    | `/api/orders/:id`                    | ✅                | Detail order milik user login      |
| GET    | `/api/health`                        | ❌                | Health check                       |

---

## 🏗️ Arsitektur & Struktur Project

```
prisma/
├── schema.prisma          # Model database (User, Product, Order, OrderItem)
├── seed.ts                # Seed: 2 user + 10 produk
├── create_tables.sql      # Command SQL create table (deliverable)
└── migrations/            # Prisma migrations

src/
├── app/
│   ├── api/               # Route handlers (auth, products, orders)
│   │   ├── auth/login/route.ts
│   │   ├── products/route.ts + [id]/route.ts
│   │   └── orders/route.ts + [id]/route.ts
│   ├── (admin)/           # FE admin (login-protected)
│   │   └── products/      # Management product (nilai tambah)
│   └── (auth)/login/      # Halaman login
├── modules/
│   ├── auth/              # FE login (components, hooks, actions)
│   └── product/           # FE product management (views, hooks, actions, services/client)
├── services/              # Business logic: auth.service.ts, product.service.ts, order.service.ts
├── repositories/          # Data access (Prisma): user, product, order repository
├── validations/           # Zod schemas: auth, product, order validation
├── libs/
│   ├── auth/              # jwt.ts (jose), password.ts (bcrypt), guard.ts (requireAuth)
│   ├── cache/redis.ts     # Redis wrapper (ioredis) + fallback aman saat Redis off
│   ├── db/prisma.ts       # PrismaClient singleton + driver adapter
│   ├── logger/winston.ts  # Request & error logging
│   ├── rate-limit/        # Rate limiter (Redis bila tersedia, fallback memory)
│   └── api/server/        # withApiHandler, successResponse/errorResponse
└── types/                 # Global types (ApiResponse, Pagination) + domain response types
```

### Layered Architecture

```
Route Handler (app/api/*)   →  Service (services/*)  →  Repository (repositories/*)  →  Prisma/PostgreSQL
     zod validation                  business logic                  data access (Prisma queries)
```

- **Route handler** = thin wrapper: parse body → zod validate → `requireAuth()` → panggil service → `successResponse`. Error ditangani `withApiHandler` (mapping AppError/ZodError → envelope + logging).
- **Service** (`src/services/`) = business logic murni (meng-_throw_ `AppError`, tidak tahu HTTP). Untuk order: transaction, cek stok, hitung total.
- **Repository** (`src/repositories/`) = hanya akses data Prisma (tidak ada business logic).

---

## 📜 Scripts

| Script                      | Fungsi                          |
| --------------------------- | ------------------------------- |
| `pnpm dev`                  | Development server              |
| `pnpm build` / `pnpm start` | Build & jalankan production     |
| `pnpm lint`                 | ESLint                          |
| `pnpm db:generate`          | Generate Prisma Client          |
| `pnpm db:migrate`           | Jalankan migration (dev)        |
| `pnpm db:deploy`            | Jalankan migration (production) |
| `pnpm db:seed`              | Seed database                   |
| `pnpm db:studio`            | Prisma Studio                   |

---

## 📝 Keputusan Teknis & Asumsi

1. **JWT dual-mode (Bearer + httpOnly cookie).** Test menyebutkan pengujian via Postman dengan header `Authorization`. FE admin (bonus) menyimpan token di httpOnly cookie (iron-session) agar aman dari XSS. Guard menerima Bearer header dahulu, fallback ke cookie — diverifikasi dengan verifier yang sama.
2. **Soft delete** product dengan kolom `deletedAt` (nullable). List & detail mengecualikan produk terhapus; DELETE hanya menandai `deletedAt` — data tetap ada untuk audit.
3. **Order transaction.** Pembuatan order memakai `prisma.$transaction` sehingga pengurangan stok + insert order + order items bersifat atomik. Decrement stok menggunakan kondisi `stock >= quantity` (`updateMany`) untuk mencegah overselling di bawah konkurensi.
4. **Snapshot harga & nama** disimpan di `OrderItem` (`productName`, `unitPrice`, `subtotal`) agar riwayat order tidak berubah walau harga/nama produk di-update kemudian.
5. **Repository layer terpisah** (`src/repositories/`) memisahkan data access dari business logic (`src/services/`), sesuai requirement "layered architecture". Validasi Zod di `src/validations/` dipakai bersama API route & FE form.
6. **Rate limiter adaptif & reusable** (`createRateLimiter` + `AdaptiveRateLimiter`): memakai Redis (`INCR` + `EXPIRE`) bila tersedia, otomatis fallback ke in-memory saat Redis tidak ada — konsisten dengan konsep cache (Redis opsional). Factory bisa dipakai di endpoint mana pun (mis. `createRateLimiter({ prefix: 'order', windowMs, max })`).
7. **Harga disimpan `Decimal(12,2)`** — tidak memakai `float` untuk menghindari masalah presisi uang. Konversi ke string pada response.
8. **Logging via Winston** hanya console transport (dev) untuk kesederhanaan; di production dapat ditambah transport file/JSON aggregator.
9. **Prisma 7** memakai driver adapter (`@prisma/adapter-pg`) yang merupakan konfigurasi resmi untuk koneksi PostgreSQL.
10. **Redis caching** pada `GET /api/products` dengan key berbasis parameter query (`products:list:{page}:{limit}:{search}:{startDate}:{endDate}:{status}`) & TTL 60 detik. Cache di-invalidasi otomatis saat create/update/soft-delete. Desain **fail-open**: bila Redis tidak tersedia, cache di-skip dan query langsung ke database — fungsionalitas inti tidak terganggu. Untuk multi-instance, rate limiter in-memory (poin 6) juga bisa dipindah ke Redis.

---

## ✅ Daftar Fitur Selesai / Belum

**Selesai:**

- [x] Login JWT + proteksi endpoint (Bearer + cookie)
- [x] Register user (role USER) — email duplikat → 409
- [x] CRUD Product + pagination + search + soft delete
- [x] Order creation (transaction, decrement stok, hitung total, anti-overselling)
- [x] List & detail order milik user login saja
- [x] Zod validation + response envelope + status code sesuai
- [x] Prisma seed (2 user + 10 produk)
- [x] SQL create table (`prisma/create_tables.sql`)
- [x] `.env.example` + README setup
- [x] Postman collection
- [x] Rate limiting (login) + request logging (Winston)
- [x] Redis caching list product (TTL + invalidasi + fallback aman)
- [x] FE admin management product (nilai tambah)

**Belum / rencana (opsional):**

- [ ] Unit/integration test (vitest)

---

## ⏱️ Estimasi Waktu Pengerjaan

| Aktivitas                                                                   | Estimasi     |
| --------------------------------------------------------------------------- | ------------ |
| Analisis technical test & gap analysis base repo                            | 0,5 jam      |
| Cleanup base repo (hapus module/pages tidak terpakai, sesuaikan arsitektur) | 1,5 jam      |
| Setup Prisma + PostgreSQL + seed                                            | 1 jam        |
| Auth (JWT, guard, login, register)                                          | 1,5 jam      |
| Product module (repository/service/validation/routes)                       | 1,5 jam      |
| Order module (transaction + routes)                                         | 1,5 jam      |
| Error handling + logging + rate limit                                       | 1 jam        |
| Redis caching list product (fallback aman)                                  | 0,5 jam      |
| FE admin product (nilai tambah)                                             | 2 jam        |
| Dokumentasi (README, Postman, SQL)                                          | 1 jam        |
| **Total**                                                                   | **± 12 jam** |

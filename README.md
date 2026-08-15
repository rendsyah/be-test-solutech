# Solutech E-Commerce API — Technical Test

REST API untuk modul inti toko online (e-commerce): **manajemen product** dan **pembuatan order**, dibangun dengan **Next.js (App Router)**, **Prisma**, dan **PostgreSQL**. Arsitektur berlapis: **route handler → service → repository**.

Dikerjakan sebagai Solutech Technical Test — Backend Developer. Frontend admin sederhana (management product) disertakan sebagai nilai tambah.

## ✨ Fitur

### Authentication (JWT)
- `POST /api/auth/login` — login, mengembalikan **JWT** (dual-mode: Bearer token untuk Postman/API client, dan httpOnly cookie via iron-session untuk browser).
- Endpoint product & order dilindungi — wajib menyertakan token.
- Password di-hash dengan `bcryptjs`; JWT ditandatangani dengan `jose` (HS256).
- **Rate limiting** pada login (5 percobaan / 15 menit per IP, sliding window in-memory).

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
- Layered architecture per module (`repositories/`, `services/server`, `validations`, `types`).

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, Route Handlers, Server Actions)
- **ORM:** Prisma 7 + PostgreSQL 16
- **Auth:** `jose` (JWT HS256), `bcryptjs`
- **Validation:** Zod 4
- **Logging:** Winston
- **UI (bonus):** React 19, Tailwind CSS 4, TanStack Query 5, React Hook Form
- **Tooling:** TypeScript, ESLint, Prettier, Husky/Commitlint

---

## 📦 Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 10.12.0
- **Docker** (untuk menjalankan PostgreSQL, opsional — bisa pakai Postgres lokal)
- **PostgreSQL** 16

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

| Variabel | Deskripsi | Contoh |
|---|---|---|
| `APP_PORT` | Port aplikasi Next.js | `3000` |
| `DATABASE_URL` | Koneksi PostgreSQL | `postgresql://solutech:solutech@localhost:5432/solutech?schema=public` |
| `JWT_SECRET` | Secret untuk menandatangani JWT (min 32 char di production; generate: `openssl rand -base64 48`) | `secret` |
| `JWT_EXPIRES_IN` | Masa berlaku token | `1h` |
| `BCRYPT_SALT_ROUNDS` | Salt rounds bcrypt | `10` |
| `SESSION_SECRET` | Secret iron-session untuk cookie FE (min 32 char; generate: `openssl rand -base64 24`) | `secret` |

### 3. Database — dua opsi

**Opsi A — PostgreSQL via Docker (disarankan):**

```bash
make db-up            # docker compose up -d db
```

**Opsi B — PostgreSQL lokal:**

Buat database & user `solutech` (atau sesuaikan `DATABASE_URL` di `.env`).

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

| Role | Email | Password |
|---|---|---|
| Admin | `admin@solutech.dev` | `admin123` |
| User | `user@solutech.dev` | `user123` |

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

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ (rate-limited) | Login → JWT + user |
| POST | `/api/auth/logout` | ❌ | Logout (hapus cookie) |
| GET | `/api/products?page=&limit=&search=` | ✅ | List product (pagination + search) |
| GET | `/api/products/:id` | ✅ | Detail product |
| POST | `/api/products` | ✅ | Create product |
| PATCH | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Soft delete product |
| POST | `/api/orders` | ✅ | Create order (transactional) |
| GET | `/api/orders?page=&limit=` | ✅ | List order milik user login |
| GET | `/api/orders/:id` | ✅ | Detail order milik user login |
| GET | `/api/health` | ❌ | Health check |

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
│   ├── auth/              # repositories, services/server, validations, types, actions, FE
│   ├── product/           # repositories, services/{server,client}, validations, types, actions, hooks, FE
│   └── order/             # repositories, services/server, validations, types
├── libs/
│   ├── auth/              # jwt.ts (jose), password.ts (bcrypt), guard.ts (requireAuth)
│   ├── db/prisma.ts       # PrismaClient singleton + driver adapter
│   ├── logger/winston.ts  # Request & error logging
│   ├── rate-limit/        # In-memory sliding window
│   └── api/server/        # withApiHandler, successResponse/errorResponse
└── types/                 # Global types (ApiResponse, Pagination)
```

### Layered Architecture

```
Route Handler (app/api/*)   →  Service (modules/*/services/server)  →  Repository (modules/*/repositories)  →  Prisma/PostgreSQL
     zod validation                    business logic                      data access (Prisma queries)
```

- **Route handler** = thin wrapper: parse body → zod validate → `requireAuth()` → panggil service → `successResponse`. Error ditangani `withApiHandler` (mapping AppError/ZodError → envelope + logging).
- **Service** = business logic murni (meng-*throw* `AppError`, tidak tahu HTTP). Untuk order: transaction, cek stok, hitung total.
- **Repository** = hanya akses data Prisma (tidak ada business logic).

---

## 📜 Scripts

| Script | Fungsi |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Build & jalankan production |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Jalankan migration (dev) |
| `pnpm db:deploy` | Jalankan migration (production) |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Prisma Studio |
| `make db-up` / `make db-down` | Start/stop PostgreSQL container |

---

## 📝 Keputusan Teknis & Asumsi

1. **JWT dual-mode (Bearer + httpOnly cookie).** Test menyebutkan pengujian via Postman dengan header `Authorization`. FE admin (bonus) menyimpan token di httpOnly cookie (iron-session) agar aman dari XSS. Guard menerima Bearer header dahulu, fallback ke cookie — diverifikasi dengan verifier yang sama.
2. **Soft delete** product dengan kolom `deletedAt` (nullable). List & detail mengecualikan produk terhapus; DELETE hanya menandai `deletedAt` — data tetap ada untuk audit.
3. **Order transaction.** Pembuatan order memakai `prisma.$transaction` sehingga pengurangan stok + insert order + order items bersifat atomik. Decrement stok menggunakan kondisi `stock >= quantity` (`updateMany`) untuk mencegah overselling di bawah konkurensi.
4. **Snapshot harga & nama** disimpan di `OrderItem` (`productName`, `unitPrice`, `subtotal`) agar riwayat order tidak berubah walau harga/nama produk di-update kemudian.
5. **Repository layer** di dalam module (`repositories/`) memisahkan data access dari business logic, sesuai requirement "layered architecture".
6. **Rate limiter in-memory** (Map per IP). Memadai untuk single-instance; untuk multi-instance/production sebaiknya diganti Redis — tercatat sebagai asumsi.
7. **Harga disimpan `Decimal(12,2)`** — tidak memakai `float` untuk menghindari masalah presisi uang. Konversi ke string pada response.
8. **Logging via Winston** hanya console transport (dev) untuk kesederhanaan; di production dapat ditambah transport file/JSON aggregator.
9. **Prisma 7** memakai driver adapter (`@prisma/adapter-pg`) yang merupakan konfigurasi resmi untuk koneksi PostgreSQL.

---

## ✅ Daftar Fitur Selesai / Belum

**Selesai:**
- [x] Login JWT + proteksi endpoint (Bearer + cookie)
- [x] CRUD Product + pagination + search + soft delete
- [x] Order creation (transaction, decrement stok, hitung total, anti-overselling)
- [x] List & detail order milik user login saja
- [x] Zod validation + response envelope + status code sesuai
- [x] Prisma seed (2 user + 10 produk)
- [x] SQL create table (`prisma/create_tables.sql`)
- [x] `.env.example` + README setup
- [x] Postman collection
- [x] Rate limiting (login) + request logging (Winston)
- [x] FE admin management product (nilai tambah)

**Belum / rencana (opsional):**
- [ ] Redis caching untuk list product (nilai tambah, butuh service Redis)
- [ ] Unit/integration test (vitest)
- [ ] Register user endpoint (saat ini cukup user seed, sesuai test)

---

## ⏱️ Estimasi Waktu Pengerjaan

| Aktivitas | Estimasi |
|---|---|
| Analisis technical test & gap analysis base repo | 0,5 jam |
| Cleanup base repo (hapus module/pages tidak terpakai, sesuaikan arsitektur) | 1,5 jam |
| Setup Prisma + PostgreSQL + seed | 1 jam |
| Auth (JWT, guard, login endpoint) | 1,5 jam |
| Product module (repository/service/validation/routes) | 1,5 jam |
| Order module (transaction + routes) | 1,5 jam |
| Error handling + logging + rate limit | 1 jam |
| FE admin product (nilai tambah) | 2 jam |
| Dokumentasi (README, Postman, SQL) | 1 jam |
| **Total** | **± 11 jam** |

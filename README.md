# Next.js App - Modern Admin & Auth System

A high-performance, strictly typed Next.js 16+ application featuring a robust admin dashboard, authentication system, and a modular architecture.

## 🌐 Live Demo

- **URL:** [https://app.rendsyah.my.id](https://app.rendsyah.my.id)
- **Username:** `admin`
- **Password:** `12345678`

## 🚀 Tech Stack

### Framework & UI
- **Framework:** [Next.js 16+](https://nextjs.org) (App Router, Server Components, Server Actions)
- **UI & Styling:** [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com)
- **Charts:** [ApexCharts](https://apexcharts.com) & `react-apexcharts`
- **Markdown:** [React Markdown](https://github.com/remarkjs/react-markdown) with [Remark GFM](https://github.com/remarkjs/remark-gfm)
- **Toasts:** [Sonner](https://sonner.emilkowal.ski)
- **Icons:** Custom SVG components

### State & Logic
- **Data Fetching:** [TanStack Query 5](https://tanstack.com/query) (React Query)
- **API Client:** [Axios](https://axios-http.com) with interceptors
- **Forms:** [React Hook Form](https://react-hook-form.com)
- **Validation:** [Zod](https://zod.dev)
- **Authentication:** [Iron Session](https://github.com/vvo/iron-session)
- **Utilities:** [Day.js](https://day.js.org), [UA Parser JS](https://faisalman.github.io/ua-parser-js), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

### Tooling
- **Language:** TypeScript
- **Linting & Formatting:** ESLint, Prettier (with import sorting)
- **Git Hooks:** Husky, Lint-staged, Commitlint
- **Deployment:** Docker, Docker Compose, Makefile

## 🏗️ Architecture & Patterns

This project follows a **Strict Module Pattern** and uses a dedicated **Server Layer** for data fetching and mutations.

### Key Principles
- **Module-First:** Features are encapsulated in `src/modules/` with local services, hooks, and components.
- **Server Services:** All API calls are abstracted into server/client services.
- **RSC & Actions:** Server Components for data fetching; Server Actions for mutations.
- **Safe State:** TanStack Query handles caching, revalidation, and loading states.
- **Proxy Middleware:** Custom middleware for session management and route protection.

## 📂 Project Structure

```text
src/
├── app/              # App Router (admin, auth, api, layouts)
├── components/       # Shared UI components (ui, forms, charts, icons)
├── modules/          # Feature modules (auth, profile, settings, etc.)
├── libs/             # Core libraries (api clients, session, constants, utils)
├── hooks/            # Shared custom hooks
├── contexts/         # Global React Contexts
├── hocs/             # Higher-Order Components (e.g., withPermission)
└── types/            # Global TypeScript definitions
```

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js:** >= 22.0.0
- **npm:** >= 10.9.0
- **Docker:** (Optional, for containerized deployment)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

**Environment Variables:**
- `APP_PORT`: Port for the Next.js application (default: 3000).
- `API_BASE_URL`: Base URL for the backend API.
- `SIGN_SECRET`: Secret used for signing (generate with `openssl rand -base64 24`).
- `SESSION_SECRET`: Secret for `iron-session` (generate with `openssl rand -base64 24`).

### 4. Development
```bash
npm run dev
```

## 📜 Available Scripts

- `npm run dev`: Start development server with HMR.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to catch code issues.
- `npm run format:check`: Check code formatting with Prettier.
- `npm run format:write`: Automatically format code with Prettier.
- `npm run generate:module <module-name>`: Generate a new module with the standard 9-folder structure.
- `npm run prepare`: Setup Husky git hooks.

## 🧱 Module Generation

To maintain architectural consistency, use the built-in scaffolding script to create new feature modules:

```bash
npm run generate:module <module-name>
```

This script generates:
- **9 Standard Folders:** `actions`, `components`, `constants`, `helpers`, `hooks`, `services`, `types`, `validations`, `views`.
- **Boilerplate:** Ready-to-use routes, headers, and a default view.
- **Strict Indexing:** Each folder includes an `index.ts` with default exports to ensure clean module boundaries.

## 🐳 Deployment

The project is containerized using Docker and includes a `Makefile` for streamlined operations.

### Makefile Commands
- `make deploy IMAGE_TAG=latest REGISTRY_HOST=...`: Deploy the application by pulling from a registry.
- `make restart`: Restart the running containers.

---

## License

This project is [UNLICENSED](LICENSE).

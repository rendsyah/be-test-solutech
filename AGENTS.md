# 🚨 AI OPERATING RULES (MANDATORY)

Next.js App Router (RSC + Server Actions). No separate backend.

---

## ❗ Core Rules
- Follow module structure & reuse patterns.
- Do NOT create new architecture or introduce new libraries.
- **Strictly NO `any` type.** Use proper types or `unknown`.
- Always use types from `types/` and `@/` aliases for imports.

---

## 🏗️ Architecture & Layering (Module Pattern)
- **UI:** `components/` (Presentation only, keep logic minimal).
- **Client Services:** `services/client` (API calls from browser).
- **Server Services:** `services/server` (API calls from RSC/Actions).
- **Data Fetching:** MUST use React Query hooks in `hooks/` for client-side.
- **Mutations:** MUST use Server Actions in `actions/`.
- **Validation:** Use Zod in `validations/`.

---

## 📡 Data Flow Guide
- **Reading Data (Client):** Component → `useQuery` (Hook) → `services/client`.
- **Reading Data (Server):** RSC → `services/server` (direct call).
- **Writing Data:** Form (RHF) → Zod Validation → Server Action → `services/server`.

---

## 🛠️ Implementation Strategy (MANDATORY)
Before coding:
1. **Search:** Find similar implementations (PRIMARY reference: `modules/users`).
2. **Pattern Match:** Match naming, folder structure, and style exactly.
3. **Logic:** Use early returns, small functions, and avoid mixing client/server code.

---

## ❌ Anti-Patterns
- Calling API/fetch directly inside components.
- Creating `/api/*` routes (Use Server Actions instead).
- Bypassing React Query for client-side state.
- Mixing `'use client'` and server logic in the same file.
- Using `any` to avoid type definitions.

---

## ✅ Pre-Output Checklist
- [ ] Matches existing module patterns & folder structure.
- [ ] No API calls in components.
- [ ] Proper typing (No `any` used).
- [ ] Uses Server Actions for data mutations.
- [ ] Code is lint-free and build-ready (`npm run build`).

**Fix all violations before returning the code.**

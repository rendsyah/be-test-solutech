# Module Pattern Reference

> Pola arsitektur module FE yang dipakai di repo ini. Diabadikan dari `src/modules/settings/users` (referensi utama) sebelum module tersebut dihapus pada tahap cleanup. Pola ini wajib diikuti saat membangun module `product` dan `order`.

## Struktur Folder

Setiap module memiliki 9 folder + 1 root `index.ts` (barrel). Generator: `node scripts/gen-module.mjs <path>`.

```
src/modules/<feature>/
├── index.ts                      # barrel: export services/client, services/server, types, views
├── actions/                      # Server Actions ('use server') — thin wrapper ke server service
├── components/                   # Komponen presentasional (Form, Header, Table, FilterModal)
├── constants/                    # routes.ts, header.ts, permissions.ts, columns.tsx, filters.ts, commons.ts
├── helpers/                      # helper murni
├── hooks/                        # useQuery wrapper + filter/export state
├── services/
│   ├── client/<feature>.service.ts   # Panggilan API dari browser (React Query)
│   └── server/<feature>.service.ts   # Panggilan API dari RSC/Actions
├── types/                        # types/dto per fitur
├── validations/                  # Zod schema + inferred DTO types
└── views/                        # Page composition ('use client'), diexport sbg *ViewPage
```

## Alur Data

- **Read (Client):** Component → `useQuery` (hooks) → `services/client` → fetch `/api/gateway/...` atau internal API.
- **Read (Server):** RSC page → `services/server` (server-only).
- **Write:** Form (RHF + zodResolver) → Server Action → `services/server`.

## Contoh Kunci (dari users module)

### validations/users.validation.ts — Zod schema + inferred DTO

```ts
import { z } from 'zod';

const baseSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
});

export const usersCreateSchema = baseSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const usersFormSchema = baseSchema
  .extend({
    id: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isCreate = !data.id;
    if (!isCreate) return;
    if (!data.password || data.password.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['password'], message: 'Password is required' });
    }
  });

export type UsersCreateDto = z.infer<typeof usersCreateSchema>;
export type UsersFormDto = z.infer<typeof usersFormSchema>;
```

### types/users.dto.ts — DTO untuk query list

```ts
export type UsersListDto = {
  page: number;
  limit: number;
  search: string;
  orderBy: string;
  sort: 'asc' | 'desc';
};
```

### services/server/users.service.ts — server-only, membungkus panggilan API

```ts
import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

export const usersServerService = {
  getDetail: async (id: string): Promise<ApiResponse<UsersDetailResponse>> => {
    return callService(externalAPI.get(`/users/detail/${id}`));
  },
  create: async (dto: UsersCreateDto): Promise<ApiResponse> => {
    return callService(externalAPI.post('/users', dto));
  },
};
```

> Catatan: `externalAPI`/`callService` telah dihapus bersama stack proxy eksternal. Untuk module baru, ganti dengan panggilan internal ke route handler sendiri atau langsung Prisma repository.

### services/client/users.service.ts — dari browser

```ts
import { internalAPI } from '@/libs/api/client';
import type { Paginated, PaginatedResponse } from '@/types';

export const usersClientService = {
  getList: async (dto: UsersListDto): Promise<PaginatedResponse<UsersListResponse>> => {
    return internalAPI.get<Paginated<UsersListResponse>>('/users/list', dto);
  },
};
```

### hooks/useUsers.tsx — React Query wrapper

```ts
import { useQuery } from '@tanstack/react-query';

import { USERS_KEY } from '../constants';
import { usersClientService } from '../services/client';
import type { UsersListDto } from '../types';

export const useUsers = (dto: UsersListDto) => {
  return useQuery({
    queryKey: [USERS_KEY, dto],
    queryFn: () => usersClientService.getList(dto),
    select: (response) => response.data,
  });
};
```

### actions/users.action.ts — Server Action thin wrapper

```ts
'use server';

import type { ActionState } from '@/types';

import { usersServerService } from '../services/server';
import type { UsersFormDto } from '../validations';

export const usersCreateAction = async (_: ActionState, dto: UsersFormDto) => {
  return usersServerService.create({
    username: dto.username,
    name: dto.name,
    email: dto.email,
  });
};
```

### views/UsersView.tsx — komposisi page

```tsx
'use client';

const UsersView = () => {
  const usersFilter = useUsersFilter();
  const debouncedSearch = useDebounce(usersFilter.filter.search, 500);
  const users = useUsers({ ...usersFilter.filter, search: debouncedSearch });

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <UsersHeader />
      </div>
      <div className="col-span-12">
        <UsersTable data={users.data?.items ?? []} meta={users.data?.meta} isLoading={users.isLoading} /* ... */ />
      </div>
    </div>
  );
};

export const UsersViewPage = withPermission(UsersView, [USERS_PERMISSIONS.view]);
```

> Catatan: `withPermission` dan `hocs/` telah dihapus. Untuk module baru cukup `export const ProductViewPage = ProductView;`.

### Page RSC (di app/.../page.tsx)

```tsx
const response = await usersServerService.getResource();
const users = unwrapResponse(response);
return <UsersViewPage users={users} />;
```

## Konvensi

- Strict TS, dilarang `any` (pakai `unknown` bila perlu).
- Import via alias `@/...`.
- Form: `react-hook-form` + `zodResolver` + `useFormAction` (di `src/hooks`).
- Komponen form validasi: `components/forms/<X>/<X>Validation.tsx` (FormField, Input, Select, dsb).
- Response envelope: `{ status, success, message, data, errors, trace_id }` (lihat `src/types/api.ts`).

import type { UserRole, UserStatus } from '@/generated/prisma/enums';

export type Options<T = string> = {
  id: T;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  image: string;
  last_login_at: string | null;
};

export type Menus = {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  level: number;
  parent_id: string | null;
  meta: Record<string, unknown> | null;
  sort: number;
  is_assigned: boolean;
  status: number;
  permissions: string[];
  child: Menus[];
};

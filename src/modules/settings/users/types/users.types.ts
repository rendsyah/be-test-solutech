import type { Menus, User } from '@/types';

export type UsersDetailResponse = {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  status: number;
  created_at: string;
  updated_at: string;
};

export type UsersResourceResponse = {
  user: User;
  menus: Menus[];
  permissions: string[];
};

export type UsersListResponse = {
  id: string;
  roles: string[];
  name: string;
  email: string;
  phone: string;
  status: number;
  status_text: string;
  created_at: string;
  updated_at: string;
};

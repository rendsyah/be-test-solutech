import type { Menus } from '@/types';

export type PermissionsResponse = Menus;

export type PermissionsDetailResponse = {
  id: string;
  name: string;
  key: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type PermissionsListResponse = {
  id: string;
  name: string;
  key: string;
  description: string;
  created_at: string;
  updated_at: string;
};

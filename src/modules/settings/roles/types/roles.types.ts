import type { Menus } from '@/types';

export type RolesDetailResponse = {
  id: string;
  name: string;
  description: string;
  status: number;
  menus: Menus[];
  created_at: string;
  updated_at: string;
};

export type RolesListResponse = {
  id: string;
  name: string;
  description: string;
  status: number;
  status_text: string;
  created_at: string;
  updated_at: string;
};

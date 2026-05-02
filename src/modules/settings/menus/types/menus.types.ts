import type { Menus } from '@/types';

export type MenusResponse = Menus;

export type MenusOptionsResponse = {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
};

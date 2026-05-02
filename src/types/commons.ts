export type Options<T = string> = {
  id: T;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  created_at: string;
  updated_at: string;
};

export type Permissions = {
  id: string;
  name: string;
  key: string;
  is_assigned: boolean;
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
  permissions: Permissions[];
  child: Menus[];
};

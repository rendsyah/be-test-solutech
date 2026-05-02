export type AuditDetailResponse = {
  id: string;
  user: string;
  action: string;
  object_id: number;
  object: string;
  diff: Record<string, string | number> | null;
  created_at: string;
  updated_at: string;
};

export type AuditListResponse = {
  id: string;
  user: string;
  action: string;
  object_id: number;
  object: string;
  created_at: string;
  updated_at: string;
};

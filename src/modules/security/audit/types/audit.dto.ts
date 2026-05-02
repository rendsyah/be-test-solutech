export type AuditListDto = {
  page: number;
  limit: number;
  orderBy: string;
  sort: 'asc' | 'desc';
  search: string;
  startDate: string;
  endDate: string;
};

export type AuditExportDto = Omit<AuditListDto, 'page' | 'limit'>;

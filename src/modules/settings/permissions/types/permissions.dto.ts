export type PermissionsListDto = {
  page: number;
  limit: number;
  orderBy: string;
  sort: 'asc' | 'desc';
  search: string;
  startDate: string;
  endDate: string;
};

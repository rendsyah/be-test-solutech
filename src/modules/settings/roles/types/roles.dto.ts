export type RolesListDto = {
  page: number;
  limit: number;
  status: string;
  orderBy: string;
  sort: 'asc' | 'desc';
  search: string;
  startDate: string;
  endDate: string;
};

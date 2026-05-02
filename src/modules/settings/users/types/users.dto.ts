export type UsersListDto = {
  page: number;
  limit: number;
  status: string;
  orderBy: string;
  sort: 'asc' | 'desc';
  search: string;
  startDate: string;
  endDate: string;
};

export type UsersExportDto = Omit<UsersListDto, 'page' | 'limit'>;

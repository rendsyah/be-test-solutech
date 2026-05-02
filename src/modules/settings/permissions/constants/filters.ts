import type { PermissionsListDto } from '../types';

export const DEFAULT_FILTER: PermissionsListDto = {
  page: 1,
  limit: 10,
  orderBy: '',
  sort: 'desc',
  search: '',
  startDate: '',
  endDate: '',
};

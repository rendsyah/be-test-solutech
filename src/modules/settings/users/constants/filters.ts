import type { UsersListDto } from '../types';

export const STATUS_OPTIONS = [
  { id: '1', name: 'Active' },
  { id: '0', name: 'Inactive' },
];

export const DEFAULT_FILTER: UsersListDto = {
  page: 1,
  limit: 10,
  status: '',
  orderBy: '',
  sort: 'desc',
  search: '',
  startDate: '',
  endDate: '',
};

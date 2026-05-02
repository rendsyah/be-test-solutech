import type { RolesListDto } from '../types';

export const STATUS_OPTIONS = [
  { id: '1', name: 'Active' },
  { id: '0', name: 'Inactive' },
];

export const DEFAULT_FILTER: RolesListDto = {
  page: 1,
  limit: 10,
  status: '',
  orderBy: '',
  sort: 'desc',
  search: '',
  startDate: '',
  endDate: '',
};

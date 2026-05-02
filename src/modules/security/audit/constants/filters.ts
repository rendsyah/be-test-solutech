import type { AuditListDto } from '../types';

export const DEFAULT_FILTER: AuditListDto = {
  page: 1,
  limit: 10,
  orderBy: '',
  sort: 'desc',
  search: '',
  startDate: '',
  endDate: '',
};

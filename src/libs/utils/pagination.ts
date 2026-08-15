import type { PaginationMeta } from '@/types';

export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => ({
  page,
  total_data: total,
  total_pages: Math.ceil(total / limit),
  total_per_page: limit,
});

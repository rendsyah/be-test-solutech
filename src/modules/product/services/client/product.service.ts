import type { PaginatedResponse } from '@/types';

import type { ProductListDto } from '../../types';
import type { ProductResponse } from '../../types';

export const productClientService = {
  getList: async (dto: ProductListDto): Promise<PaginatedResponse<ProductResponse>> => {
    const params = new URLSearchParams({
      page: String(dto.page),
      limit: String(dto.limit),
      search: dto.search,
    });
    const response = await fetch(`/api/products?${params.toString()}`, {
      cache: 'no-store',
    });
    return response.json();
  },
};

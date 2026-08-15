import type { PaginatedResponse } from '@/types';
import type { ProductListDto } from '@/types';
import type { ProductResponse } from '@/types';

export const productClientService = {
  getList: async (dto: ProductListDto): Promise<PaginatedResponse<ProductResponse>> => {
    const params = new URLSearchParams({
      page: String(dto.page),
      limit: String(dto.limit),
    });

    if (dto.search) params.set('search', dto.search);
    if (dto.startDate) params.set('startDate', dto.startDate);
    if (dto.endDate) params.set('endDate', dto.endDate);
    if (dto.status) params.set('status', dto.status);

    const response = await fetch(`/api/products?${params.toString()}`, {
      cache: 'no-store',
    });
    return response.json();
  },
};

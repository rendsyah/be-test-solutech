import { useQuery } from '@tanstack/react-query';

import type { ProductListDto } from '@/types';

import { productClientService } from '../services/client';

export const PRODUCT_KEY = 'products';

export const useProducts = (dto: ProductListDto) => {
  return useQuery({
    queryKey: [PRODUCT_KEY, dto],
    queryFn: () => productClientService.getList(dto),
    select: (response) => response.data,
  });
};

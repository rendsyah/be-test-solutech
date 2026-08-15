import { useQuery } from '@tanstack/react-query';

import type { ProductResponse } from '../types';
import { PRODUCT_KEY } from './useProducts';

const getById = async (id: string): Promise<ProductResponse> => {
  const response = await fetch(`/api/products/${id}`, { cache: 'no-store' });
  const body = await response.json();
  return body.data;
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: [PRODUCT_KEY, 'detail', id],
    queryFn: () => getById(id),
    enabled: !!id,
  });
};

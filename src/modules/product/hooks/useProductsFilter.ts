import { useCallback, useState } from 'react';

import type { ProductListDto } from '../types';

const DEFAULT_FILTER: ProductListDto = {
  page: 1,
  limit: 10,
  search: '',
};

export const useProductsFilter = () => {
  const [filter, setFilter] = useState<ProductListDto>(DEFAULT_FILTER);

  const onSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const onPageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  const onLimitChange = useCallback((limit: number) => {
    setFilter((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const onReset = useCallback(() => {
    setFilter(DEFAULT_FILTER);
  }, []);

  return {
    filter,
    onSearch,
    onPageChange,
    onLimitChange,
    onReset,
  };
};

import { useCallback, useState } from 'react';

import type { ProductListDto } from '@/types';

const DEFAULT_FILTER: ProductListDto = {
  page: 1,
  limit: 10,
  search: '',
  startDate: '',
  endDate: '',
  status: '',
};

export const useProductsFilter = () => {
  const [filter, setFilter] = useState<ProductListDto>(DEFAULT_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const onSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const onPageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  const onLimitChange = useCallback((limit: number) => {
    setFilter((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const onOpenFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

  const onCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const onApplyFilter = useCallback(
    (data: Pick<ProductListDto, 'startDate' | 'endDate' | 'status'>) => {
      setFilter((prev) => ({ ...prev, ...data, page: 1 }));
      setIsFilterOpen(false);
    },
    [],
  );

  const onResetFilter = useCallback(() => {
    setFilter((prev) => ({
      ...prev,
      startDate: '',
      endDate: '',
      status: '',
      page: 1,
    }));
    setIsFilterOpen(false);
  }, []);

  return {
    filter,
    isFilterOpen,
    onSearch,
    onPageChange,
    onLimitChange,
    onOpenFilter,
    onCloseFilter,
    onApplyFilter,
    onResetFilter,
  };
};

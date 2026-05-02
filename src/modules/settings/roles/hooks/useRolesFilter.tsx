import { useCallback, useState } from 'react';

import { DEFAULT_FILTER } from '../constants';
import type { RolesListDto } from '../types';

export const useRolesFilter = () => {
  const [filter, setFilter] = useState<RolesListDto>(DEFAULT_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const onOpenFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

  const onCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const onSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const onPageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  }, []);

  const onLimitChange = useCallback((limit: number) => {
    setFilter((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const onStatusChange = useCallback((status: string) => {
    setFilter((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const onSortChange = useCallback((key: string) => {
    setFilter((prev) => ({
      ...prev,
      orderBy: key,
      sort: prev.orderBy === key && prev.sort === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const onDateChange = useCallback((startDate: string, endDate: string) => {
    setFilter((prev) => ({ ...prev, startDate, endDate, page: 1 }));
  }, []);

  const onApplyFilter = useCallback(
    (status: string, startDate: string, endDate: string) => {
      setFilter((prev) => ({
        ...prev,
        status,
        startDate,
        endDate,
        page: 1,
      }));
      onCloseFilter();
    },
    [onCloseFilter],
  );

  const onResetFilter = useCallback(() => setFilter(DEFAULT_FILTER), []);

  return {
    filter,
    isFilterOpen,
    onOpenFilter,
    onCloseFilter,
    onSearch,
    onPageChange,
    onLimitChange,
    onStatusChange,
    onSortChange,
    onDateChange,
    onApplyFilter,
    onResetFilter,
  };
};

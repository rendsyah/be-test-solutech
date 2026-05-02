import { useCallback, useState } from 'react';

import { internalAPI } from '@/libs/api/client';

import type { UsersExportDto } from '../types';

export const useUsersExport = (dto: UsersExportDto) => {
  const [isExport, setIsExport] = useState(false);

  const onExport = useCallback(() => {
    setIsExport(true);

    internalAPI.stream('/users/export', {
      search: dto.search,
      status: dto.status,
      startDate: dto.startDate,
      endDate: dto.endDate,
      orderBy: dto.orderBy,
      sort: dto.sort,
    });

    setTimeout(() => setIsExport(false), 2000);
  }, [dto]);

  return { isExport, onExport };
};

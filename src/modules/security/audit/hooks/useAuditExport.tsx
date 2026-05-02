import { useCallback, useState } from 'react';

import { internalAPI } from '@/libs/api/client';

import type { AuditExportDto } from '../types';

export const useAuditExport = (dto: AuditExportDto) => {
  const [isExport, setIsExport] = useState(false);

  const onExport = useCallback(() => {
    setIsExport(true);

    internalAPI.stream('/audit/export', {
      search: dto.search,
      startDate: dto.startDate,
      endDate: dto.endDate,
      orderBy: dto.orderBy,
      sort: dto.sort,
    });

    setTimeout(() => setIsExport(false), 2000);
  }, [dto]);

  return { isExport, onExport };
};

import { useQuery } from '@tanstack/react-query';

import { AUDIT_KEY } from '../constants';
import { auditClientService } from '../services/client';
import type { AuditListDto } from '../types';

export const useAudit = (dto: AuditListDto) => {
  return useQuery({
    queryKey: [AUDIT_KEY, dto],
    queryFn: () => auditClientService.getList(dto),
    select: (response) => response.data,
  });
};

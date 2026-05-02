import { internalAPI } from '@/libs/api/client';
import type { Paginated, PaginatedResponse } from '@/types';

import type { AuditListDto, AuditListResponse } from '../../types';

export const auditClientService = {
  getList: async (dto: AuditListDto): Promise<PaginatedResponse<AuditListResponse>> => {
    return internalAPI.get<Paginated<AuditListResponse>>('/audit/list', dto);
  },
};

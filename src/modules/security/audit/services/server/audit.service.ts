import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

import type { AuditDetailResponse } from '../../types';

export const auditServerService = {
  getDetail: async (id: string): Promise<ApiResponse<AuditDetailResponse>> => {
    return callService(externalAPI.get(`/audit/detail/${id}`));
  },
};

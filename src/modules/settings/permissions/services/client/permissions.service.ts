import { internalAPI } from '@/libs/api/client';
import type { Paginated, PaginatedResponse } from '@/types';

import type { PermissionsListDto, PermissionsListResponse } from '../../types';

export const permissionsClientService = {
  getList: async (dto: PermissionsListDto): Promise<PaginatedResponse<PermissionsListResponse>> => {
    return internalAPI.get<Paginated<PermissionsListResponse>>('/permissions/list', dto);
  },
};

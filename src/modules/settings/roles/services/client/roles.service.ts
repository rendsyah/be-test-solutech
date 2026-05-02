import { internalAPI } from '@/libs/api/client';
import type { Paginated, PaginatedResponse } from '@/types';

import type { RolesListDto, RolesListResponse } from '../../types';

export const rolesClientService = {
  getList: async (dto: RolesListDto): Promise<PaginatedResponse<RolesListResponse>> => {
    return internalAPI.get<Paginated<RolesListResponse>>('/roles/list', dto);
  },
};

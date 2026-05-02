import { internalAPI } from '@/libs/api/client';
import type { Paginated, PaginatedResponse } from '@/types';

import type { UsersListDto, UsersListResponse } from '../../types';

export const usersClientService = {
  getList: async (dto: UsersListDto): Promise<PaginatedResponse<UsersListResponse>> => {
    return internalAPI.get<Paginated<UsersListResponse>>('/users/list', dto);
  },
};

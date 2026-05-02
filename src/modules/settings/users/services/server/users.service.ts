import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

import type { UsersDetailResponse, UsersResourceResponse } from '../../types';
import type { UsersCreateDto, UsersUpdateDto } from '../../validations';

export const usersServerService = {
  getDetail: async (id: string): Promise<ApiResponse<UsersDetailResponse>> => {
    return callService(externalAPI.get(`/users/detail/${id}`));
  },
  getResource: async (): Promise<ApiResponse<UsersResourceResponse>> => {
    return callService(externalAPI.get('/users/resource'));
  },
  create: async (dto: UsersCreateDto): Promise<ApiResponse> => {
    return callService(externalAPI.post('/users', dto));
  },
  update: async (dto: UsersUpdateDto): Promise<ApiResponse> => {
    return callService(externalAPI.patch(`/users/${dto.id}`, dto));
  },
};

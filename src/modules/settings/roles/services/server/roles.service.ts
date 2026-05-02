import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse, Options } from '@/types';

import type { RolesDetailResponse } from '../../types';
import type { RolesCreateDto, RolesUpdateDto } from '../../validations';

export const rolesServerService = {
  getDetail: async (id: string): Promise<ApiResponse<RolesDetailResponse>> => {
    return callService(externalAPI.get(`/roles/detail/${id}`));
  },
  getOptions: async (): Promise<ApiResponse<Options[]>> => {
    return callService(externalAPI.get('/roles/options'));
  },
  create: async (dto: RolesCreateDto): Promise<ApiResponse> => {
    return callService(externalAPI.post('/roles', dto));
  },
  update: async (dto: RolesUpdateDto): Promise<ApiResponse> => {
    return callService(externalAPI.patch(`/roles/${dto.id}`, dto));
  },
};

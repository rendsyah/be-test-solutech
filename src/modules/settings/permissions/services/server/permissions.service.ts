import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse, Options } from '@/types';

import type { PermissionsDetailResponse, PermissionsResponse } from '../../types';
import type { PermissionsCreateDto } from '../../validations';

export const permissionsServerService = {
  get: async (): Promise<ApiResponse<PermissionsResponse[]>> => {
    return callService(externalAPI.get('/permissions'));
  },
  getOptions: async (): Promise<ApiResponse<Options[]>> => {
    return callService(externalAPI.get('/permissions/options'));
  },
  getDetail: async (id: string): Promise<ApiResponse<PermissionsDetailResponse>> => {
    return callService(externalAPI.get(`/permissions/detail/${id}`));
  },
  create: async (dto: PermissionsCreateDto): Promise<ApiResponse> => {
    return callService(externalAPI.post('/permissions', dto));
  },
};

import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

import type { MenusOptionsResponse, MenusResponse } from '../../types';
import type { MenusUpdateDto } from '../../validations';

export const menusServerService = {
  get: async (): Promise<ApiResponse<MenusResponse[]>> => {
    return callService(externalAPI.get('/menus'));
  },
  getOptions: async (): Promise<ApiResponse<MenusOptionsResponse[]>> => {
    return callService(externalAPI.get('/menus/options'));
  },
  update: async (dto: MenusUpdateDto): Promise<ApiResponse> => {
    return callService(externalAPI.patch(`/menus/${dto.id}`, dto));
  },
};

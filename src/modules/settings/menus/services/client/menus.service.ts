import { internalAPI } from '@/libs/api/client';
import type { ApiResponse } from '@/types';

import type { MenusResponse } from '../../types';

export const menusClientService = {
  get: async (): Promise<ApiResponse<MenusResponse[]>> => {
    return internalAPI.get<MenusResponse[]>('/menus');
  },
};

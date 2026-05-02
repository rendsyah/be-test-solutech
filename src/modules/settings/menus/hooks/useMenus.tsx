import { useQuery } from '@tanstack/react-query';

import type { ApiResponse } from '@/types';

import { MENUS_KEY } from '../constants';
import { menusClientService } from '../services/client';
import type { MenusResponse } from '../types';

export const useMenus = (initialData?: MenusResponse[]) => {
  return useQuery<ApiResponse<MenusResponse[]>, Error, MenusResponse[]>({
    queryKey: [MENUS_KEY],
    queryFn: () => menusClientService.get(),
    initialData: initialData
      ? {
          data: initialData,
          success: true,
          message: 'Initial data from RSC',
          status: 200,
        }
      : undefined,
    initialDataUpdatedAt: () => Date.now(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

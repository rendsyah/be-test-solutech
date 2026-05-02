import { useQuery } from '@tanstack/react-query';

import { PERMISSIONS_KEY } from '../constants';
import { permissionsClientService } from '../services/client';
import type { PermissionsListDto } from '../types';

export const usePermissions = (dto: PermissionsListDto) => {
  return useQuery({
    queryKey: [PERMISSIONS_KEY, dto],
    queryFn: () => permissionsClientService.getList(dto),
    select: (response) => response.data,
  });
};

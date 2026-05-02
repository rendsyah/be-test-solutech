import { useQuery } from '@tanstack/react-query';

import { ROLES_KEY } from '../constants';
import { rolesClientService } from '../services/client';
import type { RolesListDto } from '../types';

export const useRoles = (dto: RolesListDto) => {
  return useQuery({
    queryKey: [ROLES_KEY, dto],
    queryFn: () => rolesClientService.getList(dto),
    select: (response) => response.data,
  });
};

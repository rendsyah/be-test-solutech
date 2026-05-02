import { useQuery } from '@tanstack/react-query';

import { USERS_KEY } from '../constants';
import { usersClientService } from '../services/client';
import type { UsersListDto } from '../types';

export const useUsers = (dto: UsersListDto) => {
  return useQuery({
    queryKey: [USERS_KEY, dto],
    queryFn: () => usersClientService.getList(dto),
    select: (response) => response.data,
  });
};

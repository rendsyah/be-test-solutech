import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

import type { UpdateAccountDto, ChangePasswordDto } from '../../validations';

export const profileServerService = {
  updateAccount: async (dto: UpdateAccountDto): Promise<ApiResponse> => {
    return callService(externalAPI.patch('/users/account', dto));
  },
  changePassword: async (dto: ChangePasswordDto): Promise<ApiResponse> => {
    return callService(externalAPI.patch('/users/change-password', dto));
  },
};

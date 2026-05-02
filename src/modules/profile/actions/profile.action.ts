'use server';

import type { ActionState } from '@/types';

import { profileServerService } from '../services/server';
import type { UpdateAccountDto, ChangePasswordDto } from '../validations';

export const updateAccountAction = async (
  _: ActionState,
  dto: UpdateAccountDto,
): Promise<ActionState> => {
  return profileServerService.updateAccount(dto);
};

export const changePasswordAction = async (
  _: ActionState,
  dto: ChangePasswordDto,
): Promise<ActionState> => {
  return profileServerService.changePassword(dto);
};

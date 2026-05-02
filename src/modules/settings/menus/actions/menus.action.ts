'use server';

import type { ActionState } from '@/types';

import { menusServerService } from '../services/server';
import type { MenusUpdateDto } from '../validations';

export const menusUpdateAction = async (
  _: ActionState,
  dto: MenusUpdateDto,
): Promise<ActionState> => {
  return menusServerService.update(dto);
};

'use server';

import type { ActionState } from '@/types';

import { permissionsServerService } from '../services/server';
import type { PermissionsCreateDto } from '../validations';

export const permissionsCreateAction = async (
  _: ActionState,
  dto: PermissionsCreateDto,
): Promise<ActionState> => {
  return permissionsServerService.create(dto);
};

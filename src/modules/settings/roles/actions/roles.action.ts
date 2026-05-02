'use server';

import type { ActionState } from '@/types';

import { rolesServerService } from '../services/server';
import type { RolesFormDto } from '../validations';

export const rolesCreateAction = async (_: ActionState, dto: RolesFormDto) => {
  return rolesServerService.create({
    name: dto.name,
    description: dto.description,
    menus: dto.menus,
    permissions: dto.permissions,
  });
};

export const rolesUpdateAction = async (_: ActionState, dto: RolesFormDto) => {
  return rolesServerService.update({
    id: dto.id!,
    name: dto.name,
    description: dto.description,
    menus: dto.menus,
    permissions: dto.permissions,
    status: dto.status!,
  });
};

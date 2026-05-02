'use server';

import type { ActionState } from '@/types';

import { usersServerService } from '../services/server';
import type { UsersFormDto } from '../validations';

export const usersCreateAction = async (_: ActionState, dto: UsersFormDto) => {
  return usersServerService.create({
    username: dto.username,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    roles: dto.roles!,
    password: dto.password!,
  });
};

export const usersUpdateAction = async (_: ActionState, dto: UsersFormDto) => {
  return usersServerService.update({
    id: dto.id,
    username: dto.username,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    roles: dto.roles!,
    status: dto.status!,
  });
};

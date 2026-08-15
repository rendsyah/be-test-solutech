'use server';

import { redirect } from 'next/navigation';

import { withAction } from '@/libs/api/server';
import { setSession } from '@/libs/session';
import { authService } from '@/services';
import type { ActionState } from '@/types';
import type { LoginResponse } from '@/types';
import type { LoginDto } from '@/validations';

export const loginAction = withAction<[ActionState<LoginResponse>, LoginDto], LoginResponse>(
  async (_, dto) => {
    const { callbackUrl, ...data } = dto;

    const result = await authService.login(data);
    await setSession(result.access_token, '/products');
    redirect(callbackUrl ?? '/products');
  },
);

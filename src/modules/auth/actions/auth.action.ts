'use server';

import { redirect } from 'next/navigation';

import { setSession } from '@/libs/session';
import { AppError } from '@/libs/utils';
import type { ActionState } from '@/types';

import { authServerService } from '../services/server';
import type { LoginResponse } from '../types';
import type { LoginDto } from '../validations';

export const loginAction = async (
  _: ActionState<LoginResponse>,
  dto: LoginDto,
): Promise<ActionState<LoginResponse>> => {
  const { callbackUrl, ...data } = dto;

  try {
    const result = await authServerService.login(data);
    await setSession(result.access_token, callbackUrl ?? '/products');
    redirect(callbackUrl ?? '/products');
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: error.status,
        success: false,
        message: error.message,
        data: null as unknown as LoginResponse,
        errors: error.errors,
        trace_id: '',
      };
    }
    throw error;
  }
};

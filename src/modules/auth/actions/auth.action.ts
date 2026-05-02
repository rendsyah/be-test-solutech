'use server';

import { redirect } from 'next/navigation';

import { setSession } from '@/libs/session';
import type { ActionState } from '@/types';

import { authServerService } from '../services/server';
import type { ForgotResponse, LoginResponse } from '../types';
import type { LoginDto, RequestOtpDto, ResetPasswordDto, VerifyOtpDto } from '../validations';

export const loginAction = async (
  _: ActionState<LoginResponse>,
  dto: LoginDto,
): Promise<ActionState<LoginResponse>> => {
  const { callbackUrl, ...data } = dto;

  const result = await authServerService.login(data);
  if (!result.success) return result;

  await setSession(result.data.access_token, result.data.redirect_to);
  redirect(callbackUrl ?? result.data.redirect_to);
};

export const requestOtpAction = async (
  _: ActionState<ForgotResponse>,
  dto: RequestOtpDto,
): Promise<ActionState<ForgotResponse>> => {
  return authServerService.requestOtp(dto);
};

export const verifyOtpAction = async (
  _: ActionState<ForgotResponse>,
  dto: VerifyOtpDto,
): Promise<ActionState<ForgotResponse>> => {
  return authServerService.verifyOtp(dto);
};

export const resetPasswordAction = async (
  _: ActionState,
  dto: ResetPasswordDto,
): Promise<ActionState> => {
  return authServerService.resetPassword(dto);
};

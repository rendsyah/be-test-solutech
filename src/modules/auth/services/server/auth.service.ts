import 'server-only';

import { externalAPI, callService } from '@/libs/api/server';
import type { ApiResponse } from '@/types';

import type { LoginResponse, ForgotResponse } from '../../types';
import type { LoginDto, RequestOtpDto, ResetPasswordDto, VerifyOtpDto } from '../../validations';

export const authServerService = {
  login: async (dto: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    return callService(externalAPI.post('/auth/login', dto));
  },
  requestOtp: async (dto: RequestOtpDto): Promise<ApiResponse<ForgotResponse>> => {
    return callService(externalAPI.post('/auth/request-otp', dto));
  },
  verifyOtp: async (dto: VerifyOtpDto): Promise<ApiResponse<ForgotResponse>> => {
    return callService(externalAPI.post('/auth/verify-otp', dto));
  },
  resetPassword: async (dto: ResetPasswordDto): Promise<ApiResponse> => {
    return callService(externalAPI.post('/auth/reset-password', dto));
  },
};

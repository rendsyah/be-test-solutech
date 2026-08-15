import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { loginRateLimiter } from '@/libs/rate-limit';
import { AppError } from '@/libs/utils';
import { authServerService } from '@/modules/auth/services/server';
import { loginSchema } from '@/modules/auth/validations';

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
};

export const POST = withApiHandler(async (request: NextRequest) => {
  const ip = getClientIp(request);
  if (!loginRateLimiter.check(ip)) {
    throw new AppError(429, 'Too many login attempts. Please try again later.');
  }

  const body = await request.json();
  const parsed = loginSchema.parse(body);
  const data = await authServerService.login(parsed);

  return successResponse(data, 'Login successful', 200);
});

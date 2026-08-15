import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { createRateLimiter } from '@/libs/rate-limit';
import { AppError } from '@/libs/utils';
import { authService } from '@/services';
import { loginSchema } from '@/validations';

const loginRateLimiter = createRateLimiter({
  prefix: 'login',
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
};

export const POST = withApiHandler(async (request: NextRequest) => {
  const ip = getClientIp(request);

  const isAllowed = await loginRateLimiter.check(ip);
  if (!isAllowed) {
    throw AppError.tooManyRequests('Too many login attempts. Please try again later.');
  }

  const body = await request.json();
  const parsed = loginSchema.parse(body);
  const data = await authService.login(parsed);

  return successResponse(data, 'Login successful', 200);
});

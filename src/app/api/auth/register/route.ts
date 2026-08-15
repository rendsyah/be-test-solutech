import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { authService } from '@/services';
import { registerSchema } from '@/validations';

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = registerSchema.parse(body);
  const data = await authService.register(parsed);

  return successResponse(data, 'Registration successful', 201);
});

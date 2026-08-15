import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { orderService } from '@/modules/order/services/server';
import { orderCreateSchema, orderQuerySchema } from '@/modules/order/validations';

export const POST = withApiHandler(async (request: NextRequest) => {
  const authUser = await requireAuth();
  const body = await request.json();
  const parsed = orderCreateSchema.parse(body);
  const data = await orderService.create(authUser.userId, parsed);
  return successResponse(data, 'Order created successfully', 201);
});

export const GET = withApiHandler(async (request: NextRequest) => {
  const authUser = await requireAuth();
  const searchParams = request.nextUrl.searchParams;
  const parsed = orderQuerySchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  });
  const data = await orderService.getList(authUser.userId, parsed);
  return successResponse(data, 'Orders fetched successfully');
});

import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { orderService } from '@/services';

type Params = { params: Promise<{ id: string }> };

export const GET = withApiHandler<NextRequest, Params>(async (_request, { params }) => {
  const authUser = await requireAuth();
  const { id } = await params;
  const data = await orderService.getById(authUser.userId, id);
  return successResponse(data, 'Order fetched successfully');
});

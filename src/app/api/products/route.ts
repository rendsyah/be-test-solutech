import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { toOptionalString } from '@/libs/utils';
import { productService } from '@/services';
import { productCreateSchema, productQuerySchema } from '@/validations';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth();

  const searchParams = request.nextUrl.searchParams;

  const parsed = productQuerySchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: toOptionalString(searchParams.get('search')),
    startDate: toOptionalString(searchParams.get('startDate')),
    endDate: toOptionalString(searchParams.get('endDate')),
    status: toOptionalString(searchParams.get('status')),
  });

  const data = await productService.getList(parsed);
  return successResponse(data, 'Products fetched successfully');
});

export const POST = withApiHandler(async (request: NextRequest) => {
  await requireAuth();

  const body = await request.json();
  const parsed = productCreateSchema.parse(body);
  const data = await productService.create(parsed);

  return successResponse(data, 'Product created successfully', 201);
});

import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { productService } from '@/modules/product/services/server';
import { productCreateSchema, productQuerySchema } from '@/modules/product/validations';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth();

  const searchParams = request.nextUrl.searchParams;
  const parsed = productQuerySchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
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

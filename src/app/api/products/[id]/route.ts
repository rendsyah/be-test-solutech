import type { NextRequest } from 'next/server';

import { successResponse, withApiHandler } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { productService } from '@/modules/product/services/server';
import { productUpdateSchema } from '@/modules/product/validations';

type Params = { params: Promise<{ id: string }> };

export const GET = withApiHandler<NextRequest, Params>(async (_request, { params }) => {
  await requireAuth();
  const { id } = await params;
  const data = await productService.getById(id);
  return successResponse(data, 'Product fetched successfully');
});

export const PATCH = withApiHandler<NextRequest, Params>(async (request, { params }) => {
  await requireAuth();
  const { id } = await params;
  const body = await request.json();
  const parsed = productUpdateSchema.parse(body);
  const data = await productService.update(id, parsed);
  return successResponse(data, 'Product updated successfully');
});

export const DELETE = withApiHandler<NextRequest, Params>(async (_request, { params }) => {
  await requireAuth();
  const { id } = await params;
  await productService.softDelete(id);
  return successResponse({ id }, 'Product deleted successfully');
});

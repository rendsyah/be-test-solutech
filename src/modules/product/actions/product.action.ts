'use server';

import { successResponse, withAction } from '@/libs/api/server';
import { requireAuth } from '@/libs/auth';
import { AppError } from '@/libs/utils';
import { productService } from '@/services';
import type { ActionState } from '@/types';
import type { ProductFormDto } from '@/validations';

export const productCreateAction = withAction(async (_: ActionState, dto: ProductFormDto) => {
  await requireAuth();
  const data = await productService.create({
    name: dto.name,
    description: dto.description,
    price: Number(dto.price),
    stock: dto.stock,
    status: dto.status,
  });
  return successResponse(data, 'Product created successfully', 201);
});

export const productUpdateAction = withAction(async (_: ActionState, dto: ProductFormDto) => {
  await requireAuth();
  if (!dto.id) {
    throw AppError.badRequest('Product ID is required');
  }
  const data = await productService.update(dto.id, {
    name: dto.name,
    description: dto.description,
    price: Number(dto.price),
    stock: dto.stock,
    status: dto.status,
  });
  return successResponse(data, 'Product updated successfully');
});

export const productDeleteAction = withAction(async (_: ActionState, id: string) => {
  await requireAuth();
  await productService.softDelete(id);
  return successResponse({ id }, 'Product deleted successfully');
});

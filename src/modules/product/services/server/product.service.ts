import 'server-only';

import type { Product } from '@/generated/prisma/client';
import { AppError } from '@/libs/utils';

import { productRepository } from '../../repositories';
import type { ProductResponse } from '../../types';
import type { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from '../../validations';

const toResponse = (product: Product): ProductResponse => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price.toString(),
  stock: product.stock,
  created_at: product.createdAt.toISOString(),
  updated_at: product.updatedAt.toISOString(),
});

export const productService = {
  getList: async (query: ProductQueryDto) => {
    const [items, total] = await Promise.all([
      productRepository.findMany(query),
      productRepository.count(query.search),
    ]);

    return {
      items: items.map(toResponse),
      meta: {
        page: query.page,
        total_data: total,
        total_pages: Math.ceil(total / query.limit),
        total_per_page: query.limit,
      },
    };
  },
  getById: async (id: string): Promise<ProductResponse> => {
    const product = await productRepository.findActiveById(id);
    if (!product) throw AppError.notFound('Product not found');
    return toResponse(product);
  },
  create: async (dto: ProductCreateDto): Promise<ProductResponse> => {
    const product = await productRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
    });
    return toResponse(product);
  },
  update: async (id: string, dto: ProductUpdateDto): Promise<ProductResponse> => {
    await productService.getById(id);
    const product = await productRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description ?? null }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
    });
    return toResponse(product);
  },
  softDelete: async (id: string): Promise<void> => {
    await productService.getById(id);
    await productRepository.softDelete(id);
  },
};

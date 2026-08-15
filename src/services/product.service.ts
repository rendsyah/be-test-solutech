import 'server-only';

import type { Product } from '@/generated/prisma/client';
import { redisCache } from '@/libs/cache';
import { AppError, buildPaginationMeta } from '@/libs/utils';
import { productRepository } from '@/repositories';
import type { ProductResponse } from '@/types';
import type { ProductCreateDto, ProductQueryDto, ProductUpdateDto } from '@/validations';

const PRODUCT_LIST_CACHE_PREFIX = 'products:list';
const PRODUCT_LIST_CACHE_TTL = 60;

const toResponse = (product: Product): ProductResponse => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price.toString(),
  stock: product.stock,
  status: product.status,
  created_at: product.createdAt.toISOString(),
  updated_at: product.updatedAt.toISOString(),
});

const buildListCacheKey = (query: ProductQueryDto): string => {
  const params = [
    query.page,
    query.limit,
    query.search,
    query.startDate,
    query.endDate,
    query.status,
  ]
    .map((value) => encodeURIComponent(String(value)))
    .join(':');

  return `${PRODUCT_LIST_CACHE_PREFIX}:${params}`;
};

const invalidateListCache = async (): Promise<void> => {
  await redisCache.del(`${PRODUCT_LIST_CACHE_PREFIX}:*`);
};

export const productService = {
  getById: async (id: string): Promise<ProductResponse> => {
    const product = await productRepository.findById(id);
    if (!product) throw AppError.notFound('Product not found');
    return toResponse(product);
  },
  getList: async (query: ProductQueryDto) => {
    const cacheKey = buildListCacheKey(query);
    const cached = await redisCache.get<{
      items: ProductResponse[];
      meta: {
        page: number;
        total_data: number;
        total_pages: number;
        total_per_page: number;
      };
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const [items, total] = await Promise.all([
      productRepository.findMany(query),
      productRepository.count(query),
    ]);

    const result = {
      items: items.map(toResponse),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };

    await redisCache.set(cacheKey, result, PRODUCT_LIST_CACHE_TTL);

    return result;
  },
  create: async (dto: ProductCreateDto): Promise<ProductResponse> => {
    const product = await productRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      status: dto.status,
    });

    await invalidateListCache();

    return toResponse(product);
  },
  update: async (id: string, dto: ProductUpdateDto): Promise<ProductResponse> => {
    await productService.getById(id);
    const product = await productRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description ?? null }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.status !== undefined && { status: dto.status }),
    });

    await invalidateListCache();

    return toResponse(product);
  },
  softDelete: async (id: string): Promise<void> => {
    await productService.getById(id);
    await productRepository.softDelete(id);

    await invalidateListCache();
  },
};

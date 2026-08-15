import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/libs/db';

type ListParams = {
  page: number;
  limit: number;
  search: string;
};

const buildWhere = (search: string): Prisma.ProductWhereInput => ({
  deletedAt: null,
  ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
});

export const productRepository = {
  findMany: ({ page, limit, search }: ListParams) => {
    const skip = (page - 1) * limit;
    return prisma.product.findMany({
      where: buildWhere(search),
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  },
  count: (search: string) => {
    return prisma.product.count({ where: buildWhere(search) });
  },
  findActiveById: (id: string) => {
    return prisma.product.findFirst({ where: { id, deletedAt: null } });
  },
  create: (data: Prisma.ProductCreateInput) => {
    return prisma.product.create({ data });
  },
  update: (id: string, data: Prisma.ProductUpdateInput) => {
    return prisma.product.update({ where: { id }, data });
  },
  softDelete: (id: string) => {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};

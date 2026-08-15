import type { Prisma, ProductStatus } from '@/generated/prisma/client';
import { prisma } from '@/libs/db';

type ListParams = {
  page: number;
  limit: number;
  search: string;
  startDate: string;
  endDate: string;
  status?: ProductStatus | '';
};

const startOfDayUtc = (date: string): Date => new Date(`${date}T00:00:00.000Z`);

const endOfDayUtc = (date: string): Date => new Date(`${date}T23:59:59.999Z`);

const buildWhere = ({
  search,
  startDate,
  endDate,
  status,
}: Pick<ListParams, 'search' | 'startDate' | 'endDate' | 'status'>): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = { deletedAt: null };

  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate ? { gte: startOfDayUtc(startDate) } : {}),
      ...(endDate ? { lte: endOfDayUtc(endDate) } : {}),
    };
  }

  return where;
};

export const productRepository = {
  findById: (id: string) => {
    return prisma.product.findFirst({ where: { id, deletedAt: null } });
  },
  findMany: (params: ListParams) => {
    const skip = (params.page - 1) * params.limit;
    return prisma.product.findMany({
      where: buildWhere(params),
      orderBy: { createdAt: 'desc' },
      skip,
      take: params.limit,
    });
  },
  count: (params: Pick<ListParams, 'search' | 'startDate' | 'endDate' | 'status'>) => {
    return prisma.product.count({ where: buildWhere(params) });
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

import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/libs/db';

type ListParams = {
  userId: string;
  page: number;
  limit: number;
};

const ORDER_INCLUDE = { items: true } satisfies Prisma.OrderInclude;

export const orderRepository = {
  findByIdForUser: (userId: string, id: string) => {
    return prisma.order.findFirst({
      where: { id, userId },
      include: ORDER_INCLUDE,
    });
  },
  findManyByUser: ({ userId, page, limit }: ListParams) => {
    const skip = (page - 1) * limit;
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: ORDER_INCLUDE,
    });
  },
  countByUser: (userId: string) => {
    return prisma.order.count({ where: { userId } });
  },
};

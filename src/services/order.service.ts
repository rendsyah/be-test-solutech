import 'server-only';

import type { Order, OrderItem } from '@/generated/prisma/client';
import { prisma } from '@/libs/db';
import { AppError, buildPaginationMeta } from '@/libs/utils';
import { orderRepository } from '@/repositories';
import type { OrderResponse } from '@/types';
import type { OrderCreateDto, OrderQueryDto } from '@/validations';

type OrderWithItems = Omit<Order, 'items'> & { items: OrderItem[] };

const toResponse = (order: OrderWithItems): OrderResponse => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  totalPrice: order.totalPrice.toString(),
  created_at: order.createdAt.toISOString(),
  updated_at: order.updatedAt.toISOString(),
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toString(),
    subtotal: item.subtotal.toString(),
  })),
});

export const orderService = {
  getById: async (userId: string, id: string): Promise<OrderResponse> => {
    const order = await orderRepository.findByIdForUser(userId, id);
    if (!order) throw AppError.notFound('Order not found');
    return toResponse(order);
  },
  getList: async (userId: string, query: OrderQueryDto) => {
    const [items, total] = await Promise.all([
      orderRepository.findManyByUser({ userId, page: query.page, limit: query.limit }),
      orderRepository.countByUser(userId),
    ]);
    return {
      items: items.map(toResponse),
      meta: buildPaginationMeta(query.page, query.limit, total),
    };
  },
  create: async (userId: string, dto: OrderCreateDto): Promise<OrderResponse> => {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds }, deletedAt: null },
        select: { id: true, name: true, price: true, stock: true },
      });

      const productMap = new Map(products.map((product) => [product.id, product]));

      for (const item of dto.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw AppError.notFound(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw AppError.conflict(`Insufficient stock for product: ${product.name}`);
        }
      }

      const results = await Promise.all(
        dto.items.map((item) =>
          tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      const failedIndex = results.findIndex((result) => result.count === 0);
      if (failedIndex !== -1) {
        const failedItem = dto.items[failedIndex];
        const product = productMap.get(failedItem.productId);
        throw AppError.conflict(
          `Insufficient stock for product: ${product?.name ?? failedItem.productId}`,
        );
      }

      const totalPrice = dto.items.reduce((sum, item) => {
        const product = productMap.get(item.productId);
        return sum + Number(product!.price) * item.quantity;
      }, 0);

      return tx.order.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: dto.items.map((item) => {
              const product = productMap.get(item.productId)!;
              const unitPrice = Number(product.price);
              return {
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice,
                subtotal: unitPrice * item.quantity,
              };
            }),
          },
        },
        include: { items: true },
      });
    });

    return toResponse(order);
  },
};

import 'server-only';

import type { Order, OrderItem } from '@/generated/prisma/client';
import { prisma } from '@/libs/db';
import { AppError } from '@/libs/utils';

import { orderRepository } from '../../repositories';
import type { OrderResponse } from '../../types';
import type { OrderCreateDto, OrderQueryDto } from '../../validations';

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
  create: async (userId: string, dto: OrderCreateDto): Promise<OrderResponse> => {
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const items: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, deletedAt: null },
          select: { id: true, name: true, price: true, stock: true },
        });
        if (!product) {
          throw AppError.notFound(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw AppError.conflict(`Insufficient stock for product: ${product.name}`);
        }

        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw AppError.conflict(`Insufficient stock for product: ${product.name}`);
        }

        const unitPrice = Number(product.price);
        totalPrice += unitPrice * item.quantity;
        items.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice,
        });
      }

      return tx.order.create({
        data: {
          userId,
          totalPrice,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });
    });

    return toResponse(order);
  },
  getList: async (userId: string, query: OrderQueryDto) => {
    const [items, total] = await Promise.all([
      orderRepository.findManyByUser({ userId, page: query.page, limit: query.limit }),
      orderRepository.countByUser(userId),
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
  getById: async (userId: string, id: string): Promise<OrderResponse> => {
    const order = await orderRepository.findByIdForUser(userId, id);
    if (!order) throw AppError.notFound('Order not found');
    return toResponse(order);
  },
};

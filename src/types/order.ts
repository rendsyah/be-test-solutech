import type { OrderStatus } from '@/generated/prisma/enums';

export type OrderItemResponse = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

export type OrderResponse = {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: string;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
};

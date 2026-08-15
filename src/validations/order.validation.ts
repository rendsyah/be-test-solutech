import { z } from 'zod';

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.coerce.number().int().positive('Quantity must be positive'),
      }),
    )
    .min(1, 'Order must have at least one item'),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type OrderCreateDto = z.infer<typeof orderCreateSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;

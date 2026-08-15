import { z } from 'zod';

import { paginationSchema } from './common.validation';

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

export const orderQuerySchema = paginationSchema;

export type OrderCreateDto = z.infer<typeof orderCreateSchema>;
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;

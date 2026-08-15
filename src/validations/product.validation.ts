import { z } from 'zod';

import { ProductStatus } from '@/generated/prisma/enums';

import { paginationSchema } from './common.validation';

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  status: z.enum(ProductStatus).default(ProductStatus.ACTIVE),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.string().min(1, 'Price is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative').default(0),
  status: z.enum(ProductStatus).default(ProductStatus.ACTIVE),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .optional()
  .default('');

export const productQuerySchema = paginationSchema.extend({
  search: z.string().optional().default(''),
  startDate: dateSchema,
  endDate: dateSchema,
  status: z.enum(ProductStatus).or(z.literal('')).default(''),
});

export type ProductCreateDto = z.infer<typeof productCreateSchema>;
export type ProductUpdateDto = z.infer<typeof productUpdateSchema>;
export type ProductFormDto = z.infer<typeof productFormSchema>;
export type ProductQueryDto = z.infer<typeof productQuerySchema>;

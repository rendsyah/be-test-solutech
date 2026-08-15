import type { ProductStatus } from '@/generated/prisma/enums';
import type { ProductQueryDto } from '@/validations';

export type ProductListDto = ProductQueryDto;

export type ProductResponse = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

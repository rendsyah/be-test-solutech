import { ProductStatus } from '@/generated/prisma/enums';
import type { Options } from '@/types';

export const PRODUCT_STATUS_OPTIONS: Options[] = [
  { id: ProductStatus.ACTIVE, name: 'Active' },
  { id: ProductStatus.INACTIVE, name: 'Inactive' },
];

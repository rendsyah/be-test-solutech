import { notFound } from 'next/navigation';

import { AppError } from '@/libs/utils';
import { ProductEditViewPage } from '@/modules/product';
import { productService } from '@/services';

type ProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;

  let product;

  try {
    product = await productService.getById(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <ProductEditViewPage product={product} />;
}

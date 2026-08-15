import { ProductEditViewPage } from '@/modules/product';

type ProductEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;
  return <ProductEditViewPage id={id} />;
}

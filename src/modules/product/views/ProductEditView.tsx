'use client';

import { ProductsHeader } from '../components';
import { ProductForm } from '../components';
import { useProductById } from '../hooks';

type ProductEditViewProps = {
  id: string;
};

export const ProductEditViewPage: React.FC<ProductEditViewProps> = ({ id }) => {
  const product = useProductById(id);

  if (product.isLoading) {
    return <p className="text-sm text-gray-400">Loading product...</p>;
  }

  if (product.isError || !product.data) {
    return <p className="text-sm text-red-600">Failed to load product.</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProductsHeader mode="edit" />
      </div>
      <div className="col-span-12">
        <ProductForm mode="edit" product={product.data} />
      </div>
    </div>
  );
};

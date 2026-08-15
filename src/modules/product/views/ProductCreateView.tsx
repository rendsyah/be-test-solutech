'use client';

import { ProductsHeader } from '../components';
import { ProductForm } from '../components';

export const ProductCreateViewPage: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProductsHeader mode="create" />
      </div>
      <div className="col-span-12">
        <ProductForm mode="create" />
      </div>
    </div>
  );
};

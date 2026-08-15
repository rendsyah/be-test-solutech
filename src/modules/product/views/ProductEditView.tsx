'use client';

import { UserRole } from '@/generated/prisma/enums';
import { withPermissions } from '@/hocs';
import type { ProductResponse } from '@/types';

import { ProductsHeader } from '../components';
import { ProductForm } from '../components';

type ProductEditViewProps = {
  product: ProductResponse;
};

const ProductEditView: React.FC<ProductEditViewProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProductsHeader mode="edit" />
      </div>
      <div className="col-span-12">
        <ProductForm mode="edit" product={product} />
      </div>
    </div>
  );
};

export const ProductEditViewPage = withPermissions<ProductEditViewProps>(ProductEditView, [
  UserRole.ADMIN,
]);

'use client';

import { UserRole } from '@/generated/prisma/enums';
import { withPermissions } from '@/hocs';

import { ProductsHeader } from '../components';
import { ProductForm } from '../components';

const ProductCreateView: React.FC = () => {
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

export const ProductCreateViewPage = withPermissions(ProductCreateView, [UserRole.ADMIN]);

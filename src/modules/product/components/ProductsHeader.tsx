import Link from 'next/link';

import { PlusIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { Breadcrumb } from '@/components/ui';

import { PRODUCT_HEADER } from '../constants';
import { PRODUCT_ROUTES } from '../constants';

type ProductsHeaderProps = {
  mode?: 'list' | 'create' | 'edit';
};

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({ mode = 'list' }) => {
  const header = PRODUCT_HEADER[mode];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <Breadcrumb
          items={[
            { label: 'Products', href: PRODUCT_ROUTES.root },
            ...(mode !== 'list'
              ? [{ label: header.title, href: undefined as string | undefined }]
              : []),
          ]}
        />
        <h1 className="text-xl font-semibold mt-2">{header.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{header.description}</p>
      </div>
      {mode === 'list' && (
        <Link href={PRODUCT_ROUTES.create}>
          <Button icon={<PlusIcon className="size-4" />}>Add Product</Button>
        </Link>
      )}
    </div>
  );
};

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, Modal } from '@/components/ui';
import { useAlert } from '@/contexts';
import { UserRole } from '@/generated/prisma/enums';
import { withPermissions } from '@/hocs';
import { useDebounce } from '@/hooks';

import { productDeleteAction } from '../actions';
import { ProductsFilterModal, ProductsHeader, ProductsTable } from '../components';
import { PRODUCT_ROUTES } from '../constants';
import { useProducts, useProductsFilter } from '../hooks';

const ProductView: React.FC = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const productsFilter = useProductsFilter();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const products = useProducts({ ...productsFilter.filter, search: debouncedSearch });

  useEffect(() => {
    productsFilter.onSearch(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    const result = await productDeleteAction(null, selectedId);
    setIsDeleting(false);
    setSelectedId(null);

    if (result?.success) {
      showAlert({
        variant: 'toast',
        type: 'success',
        title: 'Success',
        message: result.message,
      });
      products.refetch();
    } else {
      showAlert({
        variant: 'modal',
        type: 'error',
        title: 'Failed',
        message: result?.message ?? 'Failed to delete product',
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProductsHeader />
      </div>
      <div className="col-span-12">
        <ProductsTable
          data={products.data?.items ?? []}
          meta={products.data?.meta}
          search={search}
          isLoading={products.isLoading}
          isError={products.isError}
          onSearch={setSearch}
          onPageChange={productsFilter.onPageChange}
          onLimitChange={productsFilter.onLimitChange}
          onEdit={(id) => router.push(PRODUCT_ROUTES.edit(id))}
          onDelete={(id) => setSelectedId(id)}
          onRetry={products.refetch}
          onFilter={productsFilter.onOpenFilter}
        />
      </div>
      <ProductsFilterModal
        key={`${productsFilter.filter.startDate}-${productsFilter.filter.endDate}-${productsFilter.filter.status}`}
        isOpen={productsFilter.isFilterOpen}
        filter={{
          startDate: productsFilter.filter.startDate,
          endDate: productsFilter.filter.endDate,
          status: productsFilter.filter.status,
        }}
        onClose={productsFilter.onCloseFilter}
        onApply={productsFilter.onApplyFilter}
        onReset={productsFilter.onResetFilter}
      />
      <Modal
        isOpen={selectedId !== null}
        title="Delete Product"
        onClose={() => setSelectedId(null)}
        action={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export const ProductViewPage = withPermissions(ProductView, [UserRole.ADMIN]);

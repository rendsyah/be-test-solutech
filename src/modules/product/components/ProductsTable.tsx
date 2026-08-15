'use client';

import { PencilSquareIcon } from '@/components/icons';
import { Button, IconButton } from '@/components/ui';
import {
  Pagination,
  Table,
  TableContainer,
  TableData,
  TableFooter,
  TableHead,
  TableToolbar,
} from '@/components/ui';
import type { ColumnDef } from '@/components/ui';
import type { PaginationMeta } from '@/types';

import type { ProductResponse } from '../types';

type ProductsTableProps = {
  data: ProductResponse[];
  meta: PaginationMeta | undefined;
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
};

const formatPrice = (value: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value));
};

export const ProductsTable: React.FC<ProductsTableProps> = ({
  data,
  meta,
  search,
  isLoading,
  isError,
  onSearch,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const columns: ColumnDef<ProductResponse>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      className: 'max-w-64',
      render: (row) => (
        <span className="text-gray-500 truncate block">{row.description ?? '-'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      align: 'right',
      render: (row) => <span>{formatPrice(row.price)}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      align: 'center',
      render: (row) => <span>{row.stock}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton aria-label="Edit" onClick={() => onEdit(row.id)}>
            <PencilSquareIcon className="size-4" />
          </IconButton>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50"
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TableContainer>
      <TableToolbar search={search} onSearch={onSearch} onFilter={() => {}} />
      <Table>
        <TableHead columns={columns} />
        <TableData
          data={data}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          onRetry={onRetry}
        />
      </Table>
      {meta && (
        <TableFooter>
          <Pagination meta={meta} onLimitChange={onLimitChange} onPageChange={onPageChange} />
        </TableFooter>
      )}
    </TableContainer>
  );
};

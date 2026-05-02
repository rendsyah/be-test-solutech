import { useRouter } from 'next/navigation';

import {
  Pagination,
  Table,
  TableContainer,
  TableData,
  TableFooter,
  TableHead,
  TableToolbar,
} from '@/components/ui';
import { useResource } from '@/contexts';
import type { PaginationMeta } from '@/types';

import { PERMISSIONS, PERMISSIONS_ROUTES, permissionsColumns } from '../constants';
import type { PermissionsListDto, PermissionsListResponse } from '../types';

type PermissionsTableProps = {
  data: PermissionsListResponse[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  filter: PermissionsListDto;
  onOpenFilter: () => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (key: string) => void;
  onRetry: () => void;
};

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  data,
  meta,
  isLoading,
  isError,
  filter,
  onOpenFilter,
  onSearch,
  onPageChange,
  onLimitChange,
  onSortChange,
  onRetry,
}) => {
  const { hasPermission } = useResource();
  const router = useRouter();

  const columns = permissionsColumns({
    onDetail: (id) => router.push(PERMISSIONS_ROUTES.detail(id)),
    canDetail: hasPermission([PERMISSIONS.view]),
  });

  return (
    <TableContainer>
      <TableToolbar search={filter.search} onSearch={onSearch} onFilter={onOpenFilter} />
      <Table>
        <TableHead
          columns={columns}
          currentSortColumn={filter.orderBy}
          currentSortOrder={filter.sort}
          onSort={onSortChange}
        />
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
          <Pagination meta={meta} onPageChange={onPageChange} onLimitChange={onLimitChange} />
        </TableFooter>
      )}
    </TableContainer>
  );
};

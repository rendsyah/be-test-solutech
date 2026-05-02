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

import { ROLES_PERMISSIONS, ROLES_ROUTES, rolesColumns } from '../constants';
import type { RolesListDto, RolesListResponse } from '../types';

type RolesTableProps = {
  data: RolesListResponse[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  filter: RolesListDto;
  onOpenFilter: () => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (key: string) => void;
  onRetry: () => void;
};

export const RolesTable: React.FC<RolesTableProps> = ({
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

  const columns = rolesColumns({
    onDetail: (id) => router.push(ROLES_ROUTES.detail(id)),
    onEdit: (id) => router.push(ROLES_ROUTES.edit(id)),
    canDetail: hasPermission([ROLES_PERMISSIONS.view]),
    canEdit: hasPermission([ROLES_PERMISSIONS.update]),
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

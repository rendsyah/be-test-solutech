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

import { USERS_PERMISSIONS, USERS_ROUTES, usersColumns } from '../constants';
import type { UsersListResponse, UsersListDto } from '../types';

type UsersTableProps = {
  data: UsersListResponse[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  isExport: boolean;
  filter: UsersListDto;
  onOpenFilter: () => void;
  onExport: () => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (key: string) => void;
  onRetry: () => void;
};

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  meta,
  isLoading,
  isError,
  isExport,
  filter,
  onOpenFilter,
  onExport,
  onSearch,
  onPageChange,
  onLimitChange,
  onSortChange,
  onRetry,
}) => {
  const { hasPermission } = useResource();
  const router = useRouter();

  const columns = usersColumns({
    onDetail: (id) => router.push(USERS_ROUTES.detail(id)),
    onEdit: (id) => router.push(USERS_ROUTES.edit(id)),
    canDetail: hasPermission([USERS_PERMISSIONS.view]),
    canEdit: hasPermission([USERS_PERMISSIONS.update]),
  });

  return (
    <TableContainer>
      <TableToolbar
        search={filter.search}
        onSearch={onSearch}
        onFilter={onOpenFilter}
        showExport={hasPermission([USERS_PERMISSIONS.export])}
        onExport={onExport}
        isExporting={isExport}
      />
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

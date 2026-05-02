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

import { AUDIT_PERMISSIONS, AUDIT_ROUTES, auditColumns } from '../constants';
import type { AuditListDto, AuditListResponse } from '../types';

type AuditTableProps = {
  data: AuditListResponse[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  isExport: boolean;
  filter: AuditListDto;
  onOpenFilter: () => void;
  onExport: () => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortChange: (key: string) => void;
  onRetry: () => void;
};

export const AuditTable: React.FC<AuditTableProps> = ({
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

  const columns = auditColumns({
    onDetail: (id) => router.push(AUDIT_ROUTES.detail(id)),
    canDetail: hasPermission([AUDIT_PERMISSIONS.view]),
  });

  return (
    <TableContainer>
      <TableToolbar
        search={filter.search}
        onSearch={onSearch}
        onFilter={onOpenFilter}
        showExport={hasPermission([AUDIT_PERMISSIONS.export])}
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

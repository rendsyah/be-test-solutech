import { TableCell, TableHeader, TableRow } from './Table';
import type { ColumnDef } from './types';

type TableHeadProps<T> = {
  columns: ColumnDef<T>[];
  currentSortColumn?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
};

export const TableHead = <T,>({
  columns,
  currentSortColumn,
  currentSortOrder,
  onSort,
}: TableHeadProps<T>) => (
  <TableHeader>
    <TableRow>
      {columns.map((column) => (
        <TableCell
          isHeader
          key={column.key}
          align={column.align ?? 'left'}
          className={column.className}
          sortable={column.sortable}
          sortKey={column.key}
          currentSortColumn={currentSortColumn}
          currentSortOrder={currentSortOrder}
          onSort={onSort}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHeader>
);

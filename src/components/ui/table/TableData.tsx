import { TableBody, TableCell, TableRow } from './Table';
import { TableState } from './TableState';
import type { ColumnDef } from './types';

type TableDataProps<T extends { id: string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry: () => void;
};

export const TableData = <T extends { id: string }>({
  data,
  columns,
  isLoading,
  isError,
  onRetry,
}: TableDataProps<T>) => (
  <TableBody>
    <TableState
      colSpan={columns.length}
      isLoading={isLoading}
      isError={isError}
      dataLength={data.length}
      onRetry={onRetry}
    />
    {data.map((row) => (
      <TableRow key={row.id}>
        {columns.map((column) => (
          <TableCell key={column.key} align={column.align ?? 'left'} className={column.className}>
            {column.render(row)}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

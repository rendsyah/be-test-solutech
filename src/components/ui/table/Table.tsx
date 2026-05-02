import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  className?: string;
};

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  className?: string;
};

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

type TableCellProps = {
  children: React.ReactNode;
  isHeader?: boolean;
  sortable?: boolean;
  sortKey?: string;
  className?: string;
  colSpan?: number;
  currentSortColumn?: string;
  currentSortOrder?: 'asc' | 'desc' | '';
  onSort?: (key: string) => void;
  align?: 'left' | 'center' | 'right';
};

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className={cn('min-w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return (
    <thead
      className={cn('text-xs uppercase bg-gray-50 border-b border-slate-100', className)}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return (
    <tbody className={cn('divide-y divide-slate-100', className)} {...props}>
      {children}
    </tbody>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  sortable,
  sortKey,
  className,
  colSpan,
  currentSortColumn,
  currentSortOrder,
  onSort,
  align = 'left',
}) => {
  const Element = isHeader ? 'th' : 'td';
  const isActive = sortKey === currentSortColumn;
  const isAsc = isActive && currentSortOrder === 'asc';
  const isDesc = isActive && currentSortOrder === 'desc';

  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  } as const;

  const justifyClass = alignMap[align];

  const onClick = () => {
    if (sortable && sortKey && onSort) onSort(sortKey);
  };

  return (
    <Element
      className={cn(
        'whitespace-nowrap px-6 py-3',
        isHeader && 'tracking-wider',
        sortable && 'cursor-pointer group',
        className,
      )}
      colSpan={colSpan}
      onClick={onClick}
    >
      <div className={cn('flex w-full', justifyClass)}>
        <span className="inline-flex items-center gap-2">
          {children}
          <span className="size-5 flex flex-col justify-center">
            {sortable && (
              <>
                <ChevronUpIcon
                  className={cn(
                    'size-2 stroke-3 transition-opacity duration-200',
                    isActive
                      ? isAsc
                        ? 'opacity-100'
                        : 'opacity-50'
                      : 'opacity-0 group-hover:opacity-50',
                  )}
                />
                <ChevronDownIcon
                  className={cn(
                    'size-2 -mt-0.5 stroke-3 transition-opacity duration-200',
                    isActive
                      ? isDesc
                        ? 'opacity-100'
                        : 'opacity-50'
                      : 'opacity-0 group-hover:opacity-50',
                  )}
                />
              </>
            )}
          </span>
        </span>
      </div>
    </Element>
  );
};

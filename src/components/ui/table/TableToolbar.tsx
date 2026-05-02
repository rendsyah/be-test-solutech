import { Input } from '@/components/forms';
import { ArrowUpIcon, FunnelIcon, SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui';

type TableToolbarProps = {
  search: string;
  onSearch: (search: string) => void;
  onFilter: () => void;
  showExport?: boolean;
  onExport?: () => void;
  isExporting?: boolean;
  children?: React.ReactNode;
};

export const TableToolbar: React.FC<TableToolbarProps> = ({
  search,
  onSearch,
  onFilter,
  showExport,
  onExport,
  isExporting,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5">
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <Button
          variant="outline"
          className="flex-1 md:flex-none md:w-30"
          icon={<FunnelIcon />}
          iconPosition="start"
          onClick={onFilter}
        >
          Filter
        </Button>
        {showExport && onExport && (
          <Button
            variant="outline"
            className="flex-1 md:flex-none md:w-30"
            icon={<ArrowUpIcon />}
            iconPosition="start"
            onClick={onExport}
            isLoading={isExporting}
            disabled={isExporting}
          >
            Export
          </Button>
        )}
        {children}
      </div>
      <div className="w-full md:w-87.5">
        <Input
          className="py-2.25"
          placeholder="Search"
          icon={<SearchIcon className="size-4" />}
          iconPosition="start"
          onChange={onSearch}
          value={search}
        />
      </div>
    </div>
  );
};

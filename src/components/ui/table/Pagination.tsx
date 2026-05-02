import { useMemo } from 'react';

import { Select } from '@/components/forms';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@/components/icons';
import { useSidebar } from '@/contexts';
import { cn, formatNumber } from '@/libs/utils';
import type { Options, PaginationMeta } from '@/types';

type PaginationProps = {
  meta: PaginationMeta;
  onLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  pageOptions?: Options[];
};

const PAGE_OPTIONS = [
  {
    id: '10',
    name: '10',
  },
  {
    id: '25',
    name: '25',
  },
  {
    id: '50',
    name: '50',
  },
];

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onLimitChange,
  onPageChange,
  pageOptions,
}) => {
  const { page, total_per_page, total_data, total_pages } = meta;
  const { isMobile } = useSidebar();

  const maxVisible = isMobile ? 2 : 4;

  const start = useMemo(() => {
    if (total_data === 0) return 0;
    return (page - 1) * total_per_page + 1;
  }, [page, total_per_page, total_data]);

  const end = useMemo(() => {
    if (total_data === 0) return 0;
    return Math.min(page * total_per_page, total_data);
  }, [page, total_per_page, total_data]);

  const pages = useMemo(() => {
    const renderPages: (number | React.JSX.Element)[] = [];

    const half = Math.floor(maxVisible / 2);
    let startPage = Math.max(1, page - half);
    let endPage = startPage + maxVisible - 1;

    if (endPage > total_pages) {
      endPage = total_pages;
      startPage = Math.max(1, total_pages - maxVisible + 1);
    }

    if (startPage > 1) {
      renderPages.push(1);
      if (startPage > 2) renderPages.push(<EllipsisHorizontalIcon className="size-5" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      renderPages.push(i);
    }

    if (endPage < total_pages) {
      if (endPage < total_pages - 1) {
        renderPages.push(<EllipsisHorizontalIcon className="size-5" />);
      }
      renderPages.push(total_pages);
    }

    return renderPages;
  }, [page, total_pages, maxVisible]);

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
      <span className="text-sm">
        Showing {formatNumber(start)} to {formatNumber(end)} of {formatNumber(total_data)} data
      </span>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm">Rows Page</span>
          <Select
            className="px-3 py-2 w-17.5"
            value={String(total_per_page)}
            onChange={(value) => onLimitChange(Number(value))}
            options={pageOptions ?? PAGE_OPTIONS}
          />
        </div>
        <div className="flex items-center gap-2 h-8">
          <button
            className={cn('rounded-full', page === 1 && 'opacity-50 cursor-not-allowed')}
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          {pages.map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={cn(
                  'min-w-8 min-h-8 px-2 text-sm text-center rounded-full transition-colors',
                  p === page
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 hover:bg-gray-100',
                )}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-2 py-1 text-sm">
                {p}
              </span>
            ),
          )}

          <button
            className={cn('rounded-full', page >= total_pages && 'opacity-50 cursor-not-allowed')}
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= total_pages}
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

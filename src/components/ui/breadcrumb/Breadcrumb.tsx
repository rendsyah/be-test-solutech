import Link from 'next/link';

import { ChevronRightIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="text-sm flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? 'text-primary font-semibold' : 'text-inherit')}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRightIcon className="size-3" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

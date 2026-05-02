import { cn } from '@/libs/utils';

type SectionProps = {
  title: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  headerExtra,
  className,
  contentClassName,
}) => {
  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-6 py-4 border-b border-slate-200">
        <h1 className="text-sm font-semibold uppercase tracking-wider">{title}</h1>
        {headerExtra && <div className="w-fit">{headerExtra}</div>}
      </div>
      <div className={cn('p-6', contentClassName)}>{children}</div>
    </div>
  );
};

import { cn } from '@/libs/utils';

type TableFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const TableFooter: React.FC<TableFooterProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-4 border-t border-slate-100', className)}>{children}</div>;
};

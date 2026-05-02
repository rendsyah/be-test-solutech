import { cn } from '@/libs/utils';

type TableContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const TableContainer: React.FC<TableContainerProps> = ({ children, className }) => {
  return <div className={cn('card flex flex-col', className)}>{children}</div>;
};

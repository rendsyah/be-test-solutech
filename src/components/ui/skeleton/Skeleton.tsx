import { cn } from '@/libs/utils';

type SkeletonProps = {
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={cn('bg-gray-100 animate-pulse', className)} />;
};

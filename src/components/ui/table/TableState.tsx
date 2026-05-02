import Image from 'next/image';

import { LoadingIcon } from '@/components/icons';

import { Button } from '../button';
import { TableCell, TableRow } from './Table';

type TableStateProps = {
  colSpan: number;
  isLoading?: boolean;
  isError?: boolean;
  dataLength: number;
  onRetry: () => void;
};

const LoadingState: React.FC = () => {
  return (
    <span className="py-3">
      <LoadingIcon className="size-6 text-primary" />
    </span>
  );
};

const ErrorState: React.FC<Pick<TableStateProps, 'onRetry'>> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <Image src="/images/state-alert.svg" alt="Alert" width={180} height={180} priority />
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg">Failed to load data.</span>
        <span className="text-gray-400">Click the button below to try again.</span>
      </div>
      <Button className="w-40" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
};
const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <Image src="/images/state-data.svg" alt="Data" width={180} height={180} priority />
      <div className="flex flex-col items-center gap-1">
        <span className="text-lg">No data available.</span>
        <span className="text-gray-400">Start by adding your data to the system.</span>
      </div>
    </div>
  );
};

export const TableState: React.FC<TableStateProps> = ({
  colSpan,
  isLoading,
  isError,
  dataLength,
  onRetry,
}) => {
  let content: React.ReactNode = null;

  if (isLoading) content = <LoadingState />;
  else if (isError) content = <ErrorState onRetry={onRetry} />;
  else if (dataLength === 0) content = <EmptyState />;

  if (!content) return null;

  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        {content}
      </TableCell>
    </TableRow>
  );
};

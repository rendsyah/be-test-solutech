import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/libs/utils';

import { Button } from '../ui';

export const Forbidden: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.replace(document.referrer || '/');
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-6 max-w-xl mx-auto',
        'h-[calc(100dvh-var(--navbar-height)-32px)]',
        'md:h-[calc(100dvh-var(--navbar-height)-48px)]',
      )}
    >
      <Image src="/images/state-alert.svg" alt="Alert" width={180} height={180} priority />
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="text-2xl font-semibold">Oops! You Can’t Access This</h1>
        <span className="text-gray-400">
          Looks like you don’t have permission to view this. Double-check your access or reach out
          for help.
        </span>
      </div>
      <Button className="w-40" onClick={handleBack}>
        Go Back
      </Button>
    </div>
  );
};

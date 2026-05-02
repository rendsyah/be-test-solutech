'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/libs/utils';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('[AdminError]', error);
  }, [error]);

  const onReset = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
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
        <h1 className="text-2xl font-semibold">Oops! Something Went Wrong</h1>
        <p className="text-gray-400">
          There was a system error while loading the page. Please try again later or contact support
          if the issue persists.
        </p>
      </div>
      <Button className="w-40" onClick={onReset}>
        Try Again
      </Button>
    </div>
  );
}

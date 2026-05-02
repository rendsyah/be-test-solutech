'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

import '@/app/globals.css';
import { Button } from '@/components/ui';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  const onReset = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <html>
      <body>
        <div className="flex flex-col justify-center items-center gap-6 max-w-xl mx-auto min-h-screen">
          <Image src="/images/state-alert.svg" alt="Alert" width={180} height={180} priority />
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-2xl font-semibold">Oops! Something Went Wrong</h1>
            <span className="text-gray-400">
              There was a system error while loading the page. Please try again later or contact
              support if the issue persists.
            </span>
          </div>
          <Button className="w-40" onClick={onReset}>
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}

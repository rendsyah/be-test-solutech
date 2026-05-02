'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';

export default function NotFoundPage() {
  const router = useRouter();

  const handleBack = () => {
    router.replace(document.referrer || '/');
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 max-w-xl mx-auto min-h-screen">
      <Image src="/images/state-search.svg" alt="Not Found" width={180} height={180} priority />
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="text-2xl font-semibold">Oops! This Page Is Missing</h1>
        <p className="text-gray-400">
          Looks like this page doesn’t exist or got moved. Try checking the URL or head back home.
        </p>
      </div>
      <Button className="w-40" onClick={handleBack}>
        Go Back
      </Button>
    </div>
  );
}

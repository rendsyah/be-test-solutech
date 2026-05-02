import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center p-6 lg:p-0">
      <div className="w-full card max-w-md mx-auto p-6 sm:p-10 flex flex-col gap-10 min-h-125 sm:min-h-135">
        <div className="mx-auto">
          <Image src="/images/logo.svg" alt="Logo" width={48} height={48} priority />
        </div>
        <div className="flex flex-col flex-1">{children}</div>
      </div>
    </div>
  );
};

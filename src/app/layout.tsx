import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';

import { QueryProvider } from '@/components/providers';
import { AlertProvider, NetworkProvider } from '@/contexts';

import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Solutech E-Commerce API',
  description: 'Technical Test - Backend Developer (Next.js, Prisma, PostgreSQL)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <NetworkProvider>
          <QueryProvider>
            <AlertProvider>{children}</AlertProvider>
          </QueryProvider>
        </NetworkProvider>
        <Toaster />
      </body>
    </html>
  );
}

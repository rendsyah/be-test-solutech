import { AuthLayout } from '@/components/layouts';

export default function AuthLayoutPage({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

import { AdminLayout } from '@/components/layouts';
import { ResourceProvider } from '@/contexts';
import type { User } from '@/types';

export const dynamic = 'force-dynamic';

const placeholderUser: User = {
  id: 0,
  name: 'Admin',
  email: 'admin@example.com',
  phone: '',
  image: '',
  created_at: '',
  updated_at: '',
};

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider user={placeholderUser} menus={[]} permissions={[]}>
      <AdminLayout>{children}</AdminLayout>
    </ResourceProvider>
  );
}

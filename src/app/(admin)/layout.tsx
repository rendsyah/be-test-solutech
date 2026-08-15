import { AdminLayout } from '@/components/layouts';
import { ResourceProvider } from '@/contexts';
import { requireAuth } from '@/libs/auth';
import { userRepository } from '@/modules/auth/repositories';
import type { Menus, User } from '@/types';

export const dynamic = 'force-dynamic';

const ADMIN_MENUS: Menus[] = [
  {
    id: '1',
    name: 'Products',
    description: 'Product management',
    path: '/products',
    icon: 'Product',
    level: 1,
    parent_id: null,
    meta: null,
    sort: 1,
    is_assigned: true,
    status: 1,
    permissions: [],
    child: [],
  },
];

const toResourceUser = (user: {
  id: string;
  name: string;
  email: string;
  role?: string;
}): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: '',
  image: '',
  role: user.role,
  created_at: '',
  updated_at: '',
});

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  let user: User;

  try {
    const authUser = await requireAuth();
    const dbUser = await userRepository.findById(authUser.userId);
    user = toResourceUser({
      id: authUser.userId,
      name: dbUser?.name ?? authUser.email,
      email: dbUser?.email ?? authUser.email,
      role: dbUser?.role ?? authUser.role,
    });
  } catch {
    user = {
      id: '',
      name: 'Guest',
      email: '',
      phone: '',
      image: '',
      role: '',
      created_at: '',
      updated_at: '',
    };
  }

  return (
    <ResourceProvider user={user} menus={ADMIN_MENUS} permissions={[]}>
      <AdminLayout>{children}</AdminLayout>
    </ResourceProvider>
  );
}

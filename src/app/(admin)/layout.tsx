import { AdminLayout } from '@/components/layouts';
import { ResourceProvider } from '@/contexts';
import type { UserRole, UserStatus } from '@/generated/prisma/enums';
import { requirePageAuth } from '@/libs/auth';
import { userRepository } from '@/repositories';
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
  role: UserRole;
  status: UserStatus;
  last_login_at: string | null;
}): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  image: '',
  last_login_at: user.last_login_at,
});

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const authUser = await requirePageAuth();
  const dbUser = await userRepository.findById(authUser.userId);

  if (!dbUser) {
    throw new Error(`User not found: ${authUser.userId}`);
  }

  const user = toResourceUser({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    status: dbUser.status,
    last_login_at: dbUser.lastLoginAt?.toISOString() ?? null,
  });

  return (
    <ResourceProvider user={user} menus={ADMIN_MENUS} permissions={[]}>
      <AdminLayout>{children}</AdminLayout>
    </ResourceProvider>
  );
}

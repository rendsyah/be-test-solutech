import { AdminLayout } from '@/components/layouts';
import { ResourceProvider } from '@/contexts';
import { unwrapResponse } from '@/libs/api/server';
import { usersServerService } from '@/modules/settings/users';

export const dynamic = 'force-dynamic';

export default async function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const response = await usersServerService.getResource();
  const resources = unwrapResponse(response);

  const { user, menus, permissions } = resources;

  return (
    <ResourceProvider user={user} menus={menus} permissions={permissions}>
      <AdminLayout>{children}</AdminLayout>
    </ResourceProvider>
  );
}

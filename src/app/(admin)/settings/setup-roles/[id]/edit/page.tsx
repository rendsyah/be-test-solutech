import { unwrapResponse } from '@/libs/api/server';
import { permissionsServerService } from '@/modules/settings/permissions';
import { RolesEditViewPage, rolesServerService } from '@/modules/settings/roles';

export default async function RolesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [permissionsResponse, roleResponse] = await Promise.all([
    permissionsServerService.get(),
    rolesServerService.getDetail(id),
  ]);

  const permissions = unwrapResponse(permissionsResponse);
  const role = unwrapResponse(roleResponse);

  return <RolesEditViewPage permissions={permissions} role={role} />;
}

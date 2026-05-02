import { unwrapResponse } from '@/libs/api/server';
import { permissionsServerService } from '@/modules/settings/permissions';
import { RolesDetailViewPage, rolesServerService } from '@/modules/settings/roles';

export default async function RolesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [permissionsResponse, roleResponse] = await Promise.all([
    permissionsServerService.get(),
    rolesServerService.getDetail(id),
  ]);

  const permissions = unwrapResponse(permissionsResponse);
  const role = unwrapResponse(roleResponse);

  return <RolesDetailViewPage permissions={permissions} role={role} />;
}

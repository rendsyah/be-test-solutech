import { unwrapResponse } from '@/libs/api/server';
import { permissionsServerService } from '@/modules/settings/permissions';
import { RolesCreateViewPage } from '@/modules/settings/roles';

export default async function RolesCreatePage() {
  const response = await permissionsServerService.get();
  const permissions = unwrapResponse(response);

  return <RolesCreateViewPage permissions={permissions} />;
}

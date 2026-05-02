import { unwrapResponse } from '@/libs/api/server';
import { rolesServerService } from '@/modules/settings/roles';
import { UsersCreateViewPage } from '@/modules/settings/users';

export default async function UsersCreatePage() {
  const response = await rolesServerService.getOptions();
  const roles = unwrapResponse(response);

  return <UsersCreateViewPage roles={roles} />;
}

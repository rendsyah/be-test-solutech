import { unwrapResponse } from '@/libs/api/server';
import { rolesServerService } from '@/modules/settings/roles';
import { UsersDetailViewPage, usersServerService } from '@/modules/settings/users';

export default async function UsersDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [rolesResponse, userResponse] = await Promise.all([
    rolesServerService.getOptions(),
    usersServerService.getDetail(id),
  ]);

  const roles = unwrapResponse(rolesResponse);
  const user = unwrapResponse(userResponse);

  return <UsersDetailViewPage roles={roles} user={user} />;
}

import { unwrapResponse } from '@/libs/api/server';
import {
  PermissionsDetailViewPage,
  permissionsServerService,
} from '@/modules/settings/permissions';

export default async function PermissionsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await permissionsServerService.getDetail(id);
  const permission = unwrapResponse(response);

  return <PermissionsDetailViewPage permission={permission} />;
}

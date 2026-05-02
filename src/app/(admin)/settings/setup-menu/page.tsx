import { unwrapResponse } from '@/libs/api/server';
import { menusServerService, MenusViewPage } from '@/modules/settings/menus';
import { permissionsServerService } from '@/modules/settings/permissions';

export default async function MenusPage() {
  const [menusResponse, optionsResponse, permissionsResponse] = await Promise.all([
    menusServerService.get(),
    menusServerService.getOptions(),
    permissionsServerService.getOptions(),
  ]);

  const menus = unwrapResponse(menusResponse);
  const menusOptions = unwrapResponse(optionsResponse);
  const permissions = unwrapResponse(permissionsResponse);

  return <MenusViewPage initialData={menus} menus={menusOptions} permissions={permissions} />;
}

'use client';

import { withPermission } from '@/hocs';
import type { Options } from '@/types';

import { MenusHierarchy, MenusForm, MenusHeader } from '../components';
import { MENUS_PERMISSIONS } from '../constants';
import { useMenus, useMenusSelection } from '../hooks';
import type { MenusOptionsResponse, MenusResponse } from '../types';

type MenusViewProps = {
  initialData: MenusResponse[];
  menus: MenusOptionsResponse[];
  permissions: Options[];
};

const MenusView: React.FC<MenusViewProps> = ({ initialData, menus, permissions }) => {
  const menusData = useMenus(initialData);
  const menusSelection = useMenusSelection(menusData.data);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <MenusHeader />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <MenusHierarchy
          data={menusData?.data ?? []}
          selected={menusSelection.selected}
          onSelect={menusSelection.onSelect}
        />
      </div>
      <div className="col-span-12 lg:col-span-9">
        <MenusForm
          menus={menus}
          permissions={permissions}
          defaultValues={menusSelection.formDefaultValues}
        />
      </div>
    </div>
  );
};

export const MenusViewPage = withPermission(MenusView, [MENUS_PERMISSIONS.view]);

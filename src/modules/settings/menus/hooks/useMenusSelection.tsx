import { useCallback, useMemo, useState } from 'react';

import type { MenusResponse } from '../types';
import type { MenusUpdateDto } from '../validations';

export const useMenusSelection = (data?: MenusResponse[]) => {
  const [selected, setSelected] = useState<MenusResponse | null>(() => data?.[0] ?? null);

  const resolvedMenu = selected ?? data?.[0] ?? null;

  const onSelect = useCallback((menu: MenusResponse) => {
    setSelected(menu);
  }, []);

  const formDefaultValues = useMemo((): MenusUpdateDto | undefined => {
    if (!resolvedMenu) return undefined;
    return {
      id: resolvedMenu.id,
      permissions: resolvedMenu.permissions.map((p) => p.id),
      name: resolvedMenu.name,
      description: resolvedMenu.description,
      sort: resolvedMenu.sort,
      parent_id: resolvedMenu.parent_id,
    };
  }, [resolvedMenu]);

  return {
    selected: resolvedMenu,
    formDefaultValues,
    onSelect,
  };
};

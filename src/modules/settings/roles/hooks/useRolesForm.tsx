import { useMemo, useState } from 'react';

import type { PermissionsResponse } from '../../permissions';
import { collectAllPermissionIds, computeMenuIds } from '../helpers';
import type { RolesFormDto } from '../validations';

export const useRolesForm = (permissions: PermissionsResponse[], defaultValues?: RolesFormDto) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(() => {
    if (!defaultValues) return new Set();
    return new Set(defaultValues.permissions);
  });

  const menuIds = useMemo(() => {
    return computeMenuIds(permissions, selectedPermissionIds);
  }, [permissions, selectedPermissionIds]);

  const totalPermissions = useMemo(() => {
    return collectAllPermissionIds(permissions).length;
  }, [permissions]);

  const onTogglePermission = (id: string) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const onToggleAllPermissions = (ids: string[]) => {
    if (ids.length === 0) return;

    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));

      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  return {
    menuIds,
    selectedPermissionIds,
    totalPermissions,
    onTogglePermission,
    onToggleAllPermissions,
  };
};

import type { PermissionsResponse } from '../../permissions';
import type { RolesDetailResponse } from '../types';

export const collectPermissionIds = (module: PermissionsResponse): string[] => {
  return [
    ...module.permissions.map((p) => p.id),
    ...module.child.flatMap((c) => collectPermissionIds(c)),
  ];
};

export const collectAllPermissionIds = (modules: PermissionsResponse[]): string[] => {
  return modules.flatMap((mod) => [
    ...mod.permissions.map((p) => p.id),
    ...collectAllPermissionIds(mod.child || []),
  ]);
};

export const extractAssignedPermissionIds = (menus: RolesDetailResponse['menus']): string[] => {
  return menus.flatMap((menu) => [
    ...menu.permissions.filter((p) => p.is_assigned).map((p) => p.id),
    ...extractAssignedPermissionIds(menu.child || []),
  ]);
};

export const computeMenuIds = (modules: PermissionsResponse[], selected: Set<string>): string[] => {
  const result = new Set<string>();

  const traverse = (mods: PermissionsResponse[]) => {
    for (const mod of mods) {
      const selfSelected = mod.permissions.some((p) => selected.has(p.id));
      const childSelected =
        mod.child?.length > 0 &&
        mod.child.some((c) => c.permissions.some((p) => selected.has(p.id)));

      if (mod.child.length === 0) {
        if (selfSelected) result.add(mod.id);
      } else {
        if (selfSelected || childSelected) result.add(mod.id);
        traverse(mod.child);
      }
    }
  };

  traverse(modules);
  return Array.from(result);
};

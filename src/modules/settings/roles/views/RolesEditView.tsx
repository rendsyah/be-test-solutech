'use client';

import { withPermission } from '@/hocs';

import type { PermissionsResponse } from '../../permissions';
import { RolesForm, RolesHeader } from '../components';
import { ROLES_PERMISSIONS } from '../constants';
import { extractAssignedPermissionIds } from '../helpers';
import type { RolesDetailResponse } from '../types';

type RolesEditProps = {
  permissions: PermissionsResponse[];
  role: RolesDetailResponse;
};

const RolesEditView: React.FC<RolesEditProps> = ({ permissions, role }) => {
  const defaultValues = {
    id: role.id,
    name: role.name,
    description: role.description,
    menus: [],
    permissions: extractAssignedPermissionIds(role.menus),
    status: role.status,
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <RolesHeader mode="edit" />
      </div>
      <div className="col-span-12">
        <RolesForm mode="edit" permissions={permissions} defaultValues={defaultValues} />
      </div>
    </div>
  );
};

export const RolesEditViewPage = withPermission(RolesEditView, [ROLES_PERMISSIONS.update]);

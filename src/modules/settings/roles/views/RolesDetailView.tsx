'use client';

import { withPermission } from '@/hocs';

import type { PermissionsResponse } from '../../permissions';
import { RolesForm, RolesHeader } from '../components';
import { ROLES_PERMISSIONS } from '../constants';
import { extractAssignedPermissionIds } from '../helpers';
import type { RolesDetailResponse } from '../types';

type RolesDetailProps = {
  permissions: PermissionsResponse[];
  role: RolesDetailResponse;
};

const RolesDetailView: React.FC<RolesDetailProps> = ({ permissions, role }) => {
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
        <RolesHeader mode="detail" />
      </div>
      <div className="col-span-12">
        <RolesForm mode="detail" permissions={permissions} defaultValues={defaultValues} />
      </div>
    </div>
  );
};

export const RolesDetailViewPage = withPermission(RolesDetailView, [ROLES_PERMISSIONS.view]);

'use client';

import { withPermission } from '@/hocs';

import type { PermissionsResponse } from '../../permissions';
import { RolesForm, RolesHeader } from '../components';
import { ROLES_PERMISSIONS } from '../constants';

type RolesCreateProps = {
  permissions: PermissionsResponse[];
};

const RolesCreateView: React.FC<RolesCreateProps> = ({ permissions }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <RolesHeader mode="create" />
      </div>
      <div className="col-span-12">
        <RolesForm mode="create" permissions={permissions} />
      </div>
    </div>
  );
};

export const RolesCreateViewPage = withPermission(RolesCreateView, [ROLES_PERMISSIONS.create]);

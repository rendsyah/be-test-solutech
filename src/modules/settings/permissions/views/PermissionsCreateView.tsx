'use client';

import { withPermission } from '@/hocs';

import { PermissionsForm, PermissionsHeader } from '../components';
import { PERMISSIONS } from '../constants';

const PermissionsCreateView: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <PermissionsHeader mode="create" />
      </div>
      <div className="col-span-12">
        <PermissionsForm mode="create" />
      </div>
    </div>
  );
};

export const PermissionsCreateViewPage = withPermission(PermissionsCreateView, [
  PERMISSIONS.create,
]);

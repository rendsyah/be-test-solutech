'use client';

import { withPermission } from '@/hocs';

import { PermissionsForm, PermissionsHeader } from '../components';
import { PERMISSIONS } from '../constants';
import type { PermissionsDetailResponse } from '../types';

type PermissionsDetailProps = {
  permission: PermissionsDetailResponse;
};

const PermissionsDetailView: React.FC<PermissionsDetailProps> = ({ permission }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <PermissionsHeader mode="detail" />
      </div>
      <div className="col-span-12">
        <PermissionsForm mode="detail" defaultValues={permission} />
      </div>
    </div>
  );
};

export const PermissionsDetailViewPage = withPermission(PermissionsDetailView, [PERMISSIONS.view]);

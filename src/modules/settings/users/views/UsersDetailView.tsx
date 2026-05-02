'use client';

import { withPermission } from '@/hocs';
import type { Options } from '@/types';

import { UsersForm, UsersHeader } from '../components';
import { USERS_PERMISSIONS } from '../constants';
import type { UsersDetailResponse } from '../types';

type UsersDetailProps = {
  roles: Options[];
  user: UsersDetailResponse;
};

const UsersDetailView: React.FC<UsersDetailProps> = ({ roles, user }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <UsersHeader mode="detail" />
      </div>
      <div className="col-span-12">
        <UsersForm mode="detail" roles={roles} defaultValues={user} />
      </div>
    </div>
  );
};

export const UsersDetailViewPage = withPermission(UsersDetailView, [USERS_PERMISSIONS.view]);

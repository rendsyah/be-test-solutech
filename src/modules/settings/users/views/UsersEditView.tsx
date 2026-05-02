'use client';

import { withPermission } from '@/hocs';
import type { Options } from '@/types';

import { UsersForm, UsersHeader } from '../components';
import { USERS_PERMISSIONS } from '../constants';
import type { UsersDetailResponse } from '../types';

type UsersEditProps = {
  roles: Options[];
  user: UsersDetailResponse;
};

const UsersEditView: React.FC<UsersEditProps> = ({ roles, user }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <UsersHeader mode="edit" />
      </div>
      <div className="col-span-12">
        <UsersForm mode="edit" roles={roles} defaultValues={user} />
      </div>
    </div>
  );
};

export const UsersEditViewPage = withPermission(UsersEditView, [USERS_PERMISSIONS.update]);

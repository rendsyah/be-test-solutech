'use client';

import { withPermission } from '@/hocs';
import type { Options } from '@/types';

import { UsersForm, UsersHeader } from '../components';
import { USERS_PERMISSIONS } from '../constants';

type UsersCreateProps = {
  roles: Options[];
};

const UsersCreateView: React.FC<UsersCreateProps> = ({ roles }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <UsersHeader mode="create" />
      </div>
      <div className="col-span-12">
        <UsersForm mode="create" roles={roles} />
      </div>
    </div>
  );
};

export const UsersCreateViewPage = withPermission(UsersCreateView, [USERS_PERMISSIONS.create]);

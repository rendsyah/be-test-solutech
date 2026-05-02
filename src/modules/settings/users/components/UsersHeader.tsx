import { useRouter } from 'next/navigation';

import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { Breadcrumb, Button } from '@/components/ui';
import { useResource } from '@/contexts';

import { USERS_HEADER, USERS_PERMISSIONS, USERS_ROUTES, type UsersHeaderMode } from '../constants';

type UsersHeaderProps = {
  mode?: UsersHeaderMode;
};

export const UsersHeader: React.FC<UsersHeaderProps> = ({ mode = 'list' }) => {
  const { hasPermission } = useResource();
  const router = useRouter();

  const { breadcrumb, title, description } = USERS_HEADER[mode];

  const handleCreateUser = () => {
    router.push(USERS_ROUTES.create);
  };

  const handleBack = () => {
    router.push(USERS_ROUTES.root);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
      {mode === 'list' ? (
        hasPermission([USERS_PERMISSIONS.create]) && (
          <Button icon={<PlusIcon />} onClick={handleCreateUser}>
            Create New User
          </Button>
        )
      ) : (
        <Button
          variant="ghost"
          className="text-primary p-0 hidden xl:flex"
          icon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back to Users
        </Button>
      )}
    </div>
  );
};

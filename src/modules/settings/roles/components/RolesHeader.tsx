import { useRouter } from 'next/navigation';

import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { Breadcrumb, Button } from '@/components/ui';
import { useResource } from '@/contexts';

import { ROLES_HEADER, ROLES_PERMISSIONS, ROLES_ROUTES, type RolesHeaderMode } from '../constants';

type RolesHeaderProps = {
  mode?: RolesHeaderMode;
};

export const RolesHeader: React.FC<RolesHeaderProps> = ({ mode = 'list' }) => {
  const { hasPermission } = useResource();
  const router = useRouter();

  const { breadcrumb, title, description } = ROLES_HEADER[mode];

  const handleCreateRole = () => {
    router.push(ROLES_ROUTES.create);
  };

  const handleBack = () => {
    router.push(ROLES_ROUTES.root);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
      {mode === 'list' ? (
        hasPermission([ROLES_PERMISSIONS.create]) && (
          <Button icon={<PlusIcon />} onClick={handleCreateRole}>
            Create New Role
          </Button>
        )
      ) : (
        <Button
          variant="ghost"
          className="text-primary p-0 hidden xl:flex"
          icon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back to Roles
        </Button>
      )}
    </div>
  );
};

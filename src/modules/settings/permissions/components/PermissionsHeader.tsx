import { useRouter } from 'next/navigation';

import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { Breadcrumb, Button } from '@/components/ui';
import { useResource } from '@/contexts';

import {
  PERMISSIONS,
  PERMISSIONS_HEADER,
  PERMISSIONS_ROUTES,
  type PermissionsHeaderMode,
} from '../constants';

type PermissionsHeaderProps = {
  mode?: PermissionsHeaderMode;
};

export const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({ mode = 'list' }) => {
  const { hasPermission } = useResource();
  const router = useRouter();

  const { breadcrumb, title, description } = PERMISSIONS_HEADER[mode];

  const handleCreatePermission = () => {
    router.push(PERMISSIONS_ROUTES.create);
  };

  const handleBack = () => {
    router.push(PERMISSIONS_ROUTES.root);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
      {mode === 'list' ? (
        hasPermission([PERMISSIONS.create]) && (
          <Button icon={<PlusIcon />} onClick={handleCreatePermission}>
            Create New Permission
          </Button>
        )
      ) : (
        <Button
          variant="ghost"
          className="text-primary p-0 hidden xl:flex"
          icon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back to Permissions
        </Button>
      )}
    </div>
  );
};

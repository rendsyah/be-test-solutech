'use client';

import { Forbidden } from '@/components/shared';
import { useResource } from '@/contexts';
import type { UserRole } from '@/generated/prisma/enums';

export const withPermissions = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
) => {
  return function WithPermissions(props: P) {
    const { user } = useResource();

    if (!allowedRoles.includes(user.role)) {
      return <Forbidden />;
    }

    return <Component {...props} />;
  };
};

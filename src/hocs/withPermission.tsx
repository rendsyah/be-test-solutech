import { Forbidden } from '@/components/shared';
import { useResource } from '@/contexts';

export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  permissions: string[],
) => {
  return function Protected(props: P) {
    const { hasPermission } = useResource();

    if (!hasPermission(permissions)) return <Forbidden />;
    return <Component {...props} />;
  };
};

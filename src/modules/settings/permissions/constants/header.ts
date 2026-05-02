import { createBreadcrumb } from '@/libs/utils';

import { PERMISSIONS_ROUTES } from './routes';

const base = [{ label: 'Settings' }, { label: 'Permissions', href: PERMISSIONS_ROUTES.root }];

export const PERMISSIONS_HEADER = {
  list: {
    title: 'Permissions',
    description: 'Manage system permissions and access rights.',
    breadcrumb: base,
  },
  create: {
    title: 'Create Permission',
    description: 'Provide the necessary information to create a new permission.',
    breadcrumb: createBreadcrumb(base, { label: 'Create Permission' }),
  },
  detail: {
    title: 'Detail Permission',
    description: 'Review detailed information for this permission.',
    breadcrumb: createBreadcrumb(base, { label: 'Detail Permission' }),
  },
} as const;

export type PermissionsHeaderMode = keyof typeof PERMISSIONS_HEADER;
export type PermissionsFormMode = Exclude<keyof typeof PERMISSIONS_HEADER, 'list'>;

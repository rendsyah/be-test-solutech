import { createBreadcrumb } from '@/libs/utils';

import { ROLES_ROUTES } from './routes';

const base = [{ label: 'Settings' }, { label: 'Roles', href: ROLES_ROUTES.root }];

export const ROLES_HEADER = {
  list: {
    title: 'Roles',
    description: 'Manage role-based access control.',
    breadcrumb: base,
  },
  create: {
    title: 'Create Role',
    description: 'Provide the necessary information to create a new role.',
    breadcrumb: createBreadcrumb(base, { label: 'Create Role' }),
  },
  detail: {
    title: 'Detail Role',
    description: 'Review detailed information for this role.',
    breadcrumb: createBreadcrumb(base, { label: 'Detail Role' }),
  },
  edit: {
    title: 'Edit Role',
    description: 'Modify role information and permissions.',
    breadcrumb: createBreadcrumb(base, { label: 'Edit Role' }),
  },
} as const;

export type RolesHeaderMode = keyof typeof ROLES_HEADER;
export type RolesFormMode = Exclude<keyof typeof ROLES_HEADER, 'list'>;

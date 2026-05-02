import { createBreadcrumb } from '@/libs/utils';

import { USERS_ROUTES } from './routes';

const base = [{ label: 'Settings' }, { label: 'Users', href: USERS_ROUTES.root }];

export const USERS_HEADER = {
  list: {
    title: 'Users',
    description: 'Manage and monitor user accounts, roles, and access permissions.',
    breadcrumb: base,
  },
  create: {
    title: 'Create User',
    description: 'Provide the necessary information to create a new user account.',
    breadcrumb: createBreadcrumb(base, { label: 'Create User' }),
  },
  detail: {
    title: 'Detail User',
    description: 'Review detailed information and assigned roles for this user.',
    breadcrumb: createBreadcrumb(base, { label: 'Detail User' }),
  },
  edit: {
    title: 'Edit User',
    description: 'Modify user information, roles, and access settings.',
    breadcrumb: createBreadcrumb(base, { label: 'Edit User' }),
  },
} as const;

export type UsersHeaderMode = keyof typeof USERS_HEADER;
export type UsersFormMode = Exclude<UsersHeaderMode, 'list'>;

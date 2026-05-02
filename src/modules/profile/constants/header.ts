import { createBreadcrumb } from '@/libs/utils';

const base = [{ label: 'Home' }];

export const PROFILE_HEADER = {
  account: {
    title: 'Account Settings',
    description: 'Update your account information.',
    breadcrumb: createBreadcrumb(base, { label: 'Account Settings' }),
  },
  changePassword: {
    title: 'Change Password',
    description: 'Change your account password to keep your account secure.',
    breadcrumb: createBreadcrumb(base, { label: 'Change Password' }),
  },
} as const;

export type ProfileHeaderMode = keyof typeof PROFILE_HEADER;

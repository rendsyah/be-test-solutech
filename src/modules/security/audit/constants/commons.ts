import type { BadgeColor } from '@/components/ui';

export const AUDIT_KEY = 'audit';

export const BREADCRUMB_LIST = [{ label: 'Security' }, { label: 'Audit' }];

export const ACTION_COLOR_MAP: Record<string, BadgeColor> = {
  Create: 'success',
  Update: 'warning',
  Delete: 'error',
  Login: 'info',
};

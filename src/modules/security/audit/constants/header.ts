import { createBreadcrumb } from '@/libs/utils';

import { AUDIT_ROUTES } from './routes';

const base = [{ label: 'Security' }, { label: 'Audit', href: AUDIT_ROUTES.root }];

export const AUDIT_HEADER = {
  list: {
    title: 'Audit',
    description: 'Track and monitor system activity logs.',
    breadcrumb: base,
  },
  detail: {
    title: 'Detail Audit',
    description: 'Review detailed information for this audit entry.',
    breadcrumb: createBreadcrumb(base, { label: 'Detail Audit' }),
  },
} as const;

export type AuditHeaderMode = keyof typeof AUDIT_HEADER;
export type AuditFormMode = Exclude<keyof typeof AUDIT_HEADER, 'list'>;

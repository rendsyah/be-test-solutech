import { DASHBOARD_ROUTES } from './routes';

const base = [{ label: 'Home' }, { label: 'Dashboard', href: DASHBOARD_ROUTES.root }];

export const DASHBOARD_HEADER = {
  main: {
    title: 'Dashboard Overview',
    description: 'Monitor your business performance, statistics, and recent activities.',
    breadcrumb: base,
  },
} as const;

export type DashboardHeaderMode = keyof typeof DASHBOARD_HEADER;

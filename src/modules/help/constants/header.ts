import { HELP_ROUTES } from './routes';

const base = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Help & Support', href: HELP_ROUTES.root },
];

export const HELP_HEADER = {
  main: {
    title: 'Help & Support',
    description: 'Find answers to common questions or reach out to our support team.',
    breadcrumb: base,
  },
} as const;

export type HelpHeaderMode = keyof typeof HELP_HEADER;

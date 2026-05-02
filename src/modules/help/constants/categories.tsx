import { CodeBracketIcon, PaperClipIcon, CheckCircleIcon } from '@/components/icons';

import type { HelpCategory } from '../types';

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Explore our detailed guides and tutorials to master the platform.',
    icon: <CodeBracketIcon className="size-6 text-primary" />,
    actionText: 'View Docs',
    href: '#',
  },
  {
    id: 'support',
    title: 'Contact Support',
    description: 'Need direct help? Our team is available 24/7 to assist you.',
    icon: <PaperClipIcon className="size-6 text-primary" />,
    actionText: 'Get Help',
    href: '#',
  },
  {
    id: 'status',
    title: 'System Status',
    description: 'Check real-time status of our services and maintenance updates.',
    icon: <CheckCircleIcon className="size-6 text-emerald-600" />,
    actionText: 'View Status',
    href: '#',
  },
];

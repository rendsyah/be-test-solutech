import { MENUS_ROUTES } from './routes';

const base = [{ label: 'Settings' }, { label: 'Menu', href: MENUS_ROUTES.root }];

export const MENUS_HEADER = {
  main: {
    title: 'Menu',
    description: 'Manage and monitor menu items and their configurations.',
    breadcrumb: base,
  },
} as const;

export type MenusHeaderMode = keyof typeof MENUS_HEADER;
export type MenusFormMode = Exclude<MenusHeaderMode, 'main'>;

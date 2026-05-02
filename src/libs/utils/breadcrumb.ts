import type { BreadcrumbItem } from '@/components/ui';

export const createBreadcrumb = (base: BreadcrumbItem[], ...items: BreadcrumbItem[]) => {
  return [...base, ...items];
};

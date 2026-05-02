import type { ReactNode } from 'react';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  actionText: string;
  href?: string;
  onClick?: () => void;
};

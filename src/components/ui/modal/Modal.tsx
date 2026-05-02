'use client';

import Image from 'next/image';

import { XMarkIcon } from '@/components/icons';
import { useBodyScrollLock } from '@/hooks';
import { cn } from '@/libs/utils';

import { IconButton } from '../button';

const SIZE_CLASSES = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
};

type ModalSize = keyof typeof SIZE_CLASSES;

export type ModalProps = {
  isOpen: boolean;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
  action?: React.ReactNode;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  size = 'md',
  children,
  action,
  onClose,
}) => {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative card z-10 w-full max-w-xs overflow-hidden', SIZE_CLASSES[size])}
      >
        <div className="flex items-center border-b border-slate-200 px-6 py-4">
          <Image src="/images/logo.svg" alt="Logo" width={24} height={24} />
          {title && (
            <h1 className="text-sm font-semibold uppercase tracking-wider ml-3">{title}</h1>
          )}
          <IconButton onClick={onClose} className="ml-auto">
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>
        <div className="p-6">{children}</div>
        {action && (
          <>
            <div className="border-t border-slate-200" />
            <div className="px-6 py-4">{action}</div>
          </>
        )}
      </div>
    </div>
  );
};

'use client';

import Image from 'next/image';

import { XMarkIcon } from '@/components/icons';
import type { AlertType } from '@/contexts';
import { useBodyScrollLock } from '@/hooks';

import { Button, IconButton } from '../button';

type AlertModalProps = {
  type: AlertType;
  title: string;
  message?: string;
  onClose: () => void;
};

type AlertConfig = {
  icon: string;
};

const ALERT_CONFIG: Record<AlertType, AlertConfig> = {
  success: {
    icon: '/icons/success.svg',
  },
  error: {
    icon: '/icons/error.svg',
  },
  warning: {
    icon: '/icons/warning.svg',
  },
  info: {
    icon: '/icons/info.svg',
  },
};

export const AlertModal: React.FC<AlertModalProps> = ({ type, title, message, onClose }) => {
  useBodyScrollLock(true);
  const config = ALERT_CONFIG[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative card z-10 w-full max-w-xs sm:max-w-sm p-6"
      >
        <div className="flex flex-col items-center space-y-8">
          <Image src={config.icon} alt={type} width={120} height={120} />
          <div className="space-y-2">
            <h1 className="text-2xl text-center font-semibold">{title}</h1>
            {message && <p className="text-sm text-center">{message}</p>}
          </div>
          <Button className="w-40" onClick={onClose}>
            Close
          </Button>
        </div>
        <IconButton onClick={onClose} className="absolute top-3 right-3">
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </div>
    </div>
  );
};

import { toast } from 'sonner';
import type { ToasterProps } from 'sonner';

import { CheckCircleIcon, InfoCircleIcon } from '@/components/icons';
import type { AlertType } from '@/contexts';
import { cn } from '@/libs/utils';

type ToastProps = {
  title: string;
  message?: string;
  type?: AlertType;
  position?: ToasterProps['position'];
};

type ToastConfig = {
  icon: React.FC<{ className?: string }>;
  color: string;
};

const TOAST_CONFIG: Record<AlertType, ToastConfig> = {
  success: {
    icon: CheckCircleIcon,
    color: 'text-emerald-500',
  },
  error: {
    icon: InfoCircleIcon,
    color: 'text-red-500',
  },
  warning: {
    icon: InfoCircleIcon,
    color: 'text-yellow-500',
  },
  info: {
    icon: InfoCircleIcon,
    color: 'text-blue-500',
  },
};

export const Toast = ({
  title,
  message,
  type = 'success',
  position = 'top-center',
}: ToastProps) => {
  const { icon: Icon, color } = TOAST_CONFIG[type];

  toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t)}
        className="w-full card flex gap-3 items-start px-4 py-3 cursor-pointer"
      >
        <Icon className={cn('w-5 h-5 shrink-0', color)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold', color)}>{title}</p>
          {message && <p className="text-sm">{message}</p>}
        </div>
      </div>
    ),
    { position },
  );
};

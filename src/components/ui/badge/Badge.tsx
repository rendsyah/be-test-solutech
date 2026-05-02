import { cn } from '@/libs/utils';

export type BadgeColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'custom';

type BadgeProps = {
  variant?: keyof typeof BADGE_VARIANTS;
  size?: keyof typeof BADGE_STYLES;
  color?: BadgeColor;
  customClass?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  readOnly?: boolean;
  children: React.ReactNode;
};

const BADGE_STYLES = {
  sm: 'text-xs',
  md: 'text-sm',
};

const BADGE_VARIANTS = {
  light: {
    primary: 'bg-primary/15 text-primary',
    success: 'bg-emerald-500/15 text-emerald-500',
    error: 'bg-red-500/15 text-red-500',
    warning: 'bg-amber-500/15 text-amber-500',
    info: 'bg-blue-500/15 text-blue-500',
    custom: '',
  },
  solid: {
    primary: 'bg-primary text-white',
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white',
    custom: '',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'light',
  color = 'primary',
  size = 'md',
  customClass,
  startIcon,
  endIcon,
  onClick,
  readOnly,
  children,
}) => {
  const sizeClasses = BADGE_STYLES[size];
  const colorClasses = BADGE_VARIANTS[variant][color];

  const handleClick = () => {
    if (readOnly || !onClick) return;
    onClick();
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 justify-center gap-1 rounded-full font-medium cursor-pointer',
        sizeClasses,
        colorClasses,
        customClass,
      )}
      onClick={handleClick}
    >
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

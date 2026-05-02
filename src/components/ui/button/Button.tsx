import { LoadingIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'start' | 'end';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  children?: React.ReactNode;
  isLoading?: boolean;
};

const BUTTON_VARIANTS = {
  primary: `bg-primary text-white shadow-xs hover:bg-primary-hover active:bg-primary disabled:bg-primary/50`,
  secondary: `bg-secondary shadow-xs hover:bg-secondary-hover active:bg-secondary disabled:bg-secondary/50`,
  outline: `border border-slate-200 shadow-xs hover:bg-gray-100 active:bg-gray-100 disabled:text-gray-400`,
  ghost: `disabled:text-gray-400`,
  danger: `bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/50`,
};

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const ICON_SIZES = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  children,
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className,
  );

  const iconClasses = cn(
    'flex-shrink-0 inline-flex items-center justify-center',
    ICON_SIZES[size],
    children && iconPosition === 'start' && 'mr-3',
    children && iconPosition === 'end' && 'ml-3',
  );

  // prettier-ignore
  return (
    <button type={type} className={baseClasses} disabled={disabled || isLoading} {...props}>
      {isLoading && <LoadingIcon className={iconClasses} />}
      {!isLoading && icon && iconPosition === 'start' && <span className={iconClasses}>{icon}</span>}
      {children}
      {!isLoading && icon && iconPosition === 'end' && <span className={iconClasses}>{icon}</span>}
    </button>
  );
};

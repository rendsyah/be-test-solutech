import { cn } from '@/libs/utils';

export type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'type'
> & {
  checked?: boolean;
  error?: boolean;
  readOnly?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  className,
  error,
  readOnly,
  disabled,
  onChange,
  ...props
}) => {
  const handleToggle = () => {
    if (disabled || readOnly) return;
    onChange?.(!checked);
  };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      className={cn(
        'relative block w-12 h-6 rounded-full shadow-xs',
        'transition-[background-color] duration-200 focus:outline-hidden',
        checked ? 'bg-primary' : 'bg-gray-200',
        error && 'ring-1 ring-red-500',
        disabled && 'cursor-not-allowed',
        className,
      )}
      aria-checked={checked}
      aria-invalid={!!error}
      aria-describedby={id && error ? `${id}-error` : undefined}
      disabled={disabled}
      onClick={handleToggle}
      {...props}
    >
      <span
        className={cn(
          'absolute top-1 left-1 w-4 h-4',
          'bg-white rounded-full shadow',
          'transform transition-transform duration-200',
          checked && 'translate-x-6',
        )}
      />
    </button>
  );
};

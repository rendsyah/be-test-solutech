import { CheckIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type'
> & {
  label?: string;
  error?: boolean;
  readOnly?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  className,
  error,
  readOnly,
  disabled,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={cn(
        'flex items-center space-x-2',
        'cursor-pointer select-none',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <div className="relative size-5">
        <input
          id={id}
          type="checkbox"
          className={cn(
            'absolute w-full h-full opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed',
          )}
          aria-invalid={!!error}
          aria-describedby={id && error ? `${id}-error` : undefined}
          checked={checked}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            'w-full h-full flex items-center justify-center',
            'border rounded shadow-xs',
            'transition-[background-color] duration-200',
            checked ? 'bg-primary border-primary' : 'border-slate-200',
            error && 'border-red-500',
          )}
        >
          <CheckIcon
            className={cn(
              'size-3 text-white',
              'transition-opacity duration-200',
              checked ? 'opacity-100' : 'opacity-0',
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

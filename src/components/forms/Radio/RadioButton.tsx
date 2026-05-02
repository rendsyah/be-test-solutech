import { cn } from '@/libs/utils';

export type RadioButtonProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type'
> & {
  label: string;
  error?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  label,
  name,
  value,
  checked,
  className,
  error,
  readOnly,
  disabled,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly || checked) return;
    onChange?.(e.target.value);
  };

  return (
    <label
      className={cn(
        'inline-flex items-center space-x-2',
        'cursor-pointer select-none',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <div className="relative size-5 flex items-center justify-center">
        <input
          id={id}
          value={value}
          checked={checked}
          type="radio"
          name={name}
          className={cn(
            'absolute w-full h-full opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed',
          )}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            'w-full h-full flex items-center justify-center',
            'border rounded-full shadow-xs',
            checked ? 'border-primary' : 'border-slate-200',
            error && 'border-red-500',
          )}
        >
          <div
            className={cn(
              'size-2 bg-primary rounded-full',
              'transition-transform duration-200',
              checked ? 'scale-100' : 'scale-0',
            )}
          />
        </div>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

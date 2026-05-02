import { cn } from '@/libs/utils';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  endIcon?: React.ReactNode;
  allowDecimal?: boolean;
  onChange?: (value: string) => void;
};

const ALLOWED_NUMERIC_KEYS = [
  'Backspace',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
  'Home',
  'End',
];

export const Input: React.FC<InputProps> = ({
  id,
  value,
  type,
  placeholder,
  className,
  inputMode,
  error,
  icon,
  iconPosition,
  endIcon,
  allowDecimal = false,
  readOnly,
  disabled,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    onChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputMode !== 'numeric') return;
    if (e.ctrlKey || e.metaKey) return;
    const key = e.key;
    const isNumber = /^[0-9]$/.test(key);
    if (isNumber || ALLOWED_NUMERIC_KEYS.includes(key)) return;
    if (allowDecimal && (key === '.' || key === ',')) {
      if (e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',')) {
        e.preventDefault();
      }
      return;
    }
    e.preventDefault();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (inputMode !== 'numeric') return;
    const paste = e.clipboardData.getData('text').trim();
    const pattern = allowDecimal ? /^\d*([.,]\d*)?$/ : /^\d+$/;
    if (!pattern.test(paste)) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        type={type}
        className={cn(
          'input',
          error && 'input-error',
          disabled && 'cursor-not-allowed',
          icon && (iconPosition === 'start' ? 'pl-12' : 'pr-12'),
          className,
        )}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={id && error ? `${id}-error` : undefined}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        readOnly={readOnly}
        disabled={disabled}
        {...props}
      />
      {icon && (
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2',
            iconPosition === 'start' ? 'left-4' : 'right-4',
          )}
        >
          {icon}
        </span>
      )}
      {endIcon && <span className="absolute right-4 top-1/2 -translate-y-1/2">{endIcon}</span>}
    </div>
  );
};

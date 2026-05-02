import { cn } from '@/libs/utils';

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  error?: boolean;
  onChange?: (value: string) => void;
};

export const Textarea: React.FC<TextareaProps> = ({
  id,
  className,
  rows = 4,
  error,
  readOnly,
  disabled,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || readOnly) return;
    onChange?.(e.target.value);
  };

  return (
    <textarea
      id={id}
      className={cn(
        'input block resize-none custom-scrollbar',
        error && 'input-error',
        disabled && 'cursor-not-allowed',
        className,
      )}
      aria-invalid={!!error}
      aria-describedby={id && error ? `${id}-error` : undefined}
      rows={rows}
      readOnly={readOnly}
      disabled={disabled}
      onChange={handleChange}
      {...props}
    />
  );
};

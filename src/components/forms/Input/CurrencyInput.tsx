import { formatCurrency, parseCurrency } from '@/libs/utils';

import type { InputProps } from './Input';
import { Input } from './Input';

export type CurrencyInputProps = Omit<InputProps, 'onChange' | 'inputMode'> & {
  onChange?: (value: string) => void;
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = '',
  disabled,
  readOnly,
  onChange,
  ...props
}) => {
  const handleChange = (value: string) => {
    if (disabled || readOnly) return;
    const parsed = parseCurrency(value);
    onChange?.(parsed);
  };

  return (
    <Input
      value={formatCurrency(value as string)}
      inputMode="numeric"
      disabled={disabled}
      readOnly={readOnly}
      onChange={handleChange}
      {...props}
    />
  );
};

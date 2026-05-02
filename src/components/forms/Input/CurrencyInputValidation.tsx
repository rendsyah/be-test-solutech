import { useController, useFormContext } from 'react-hook-form';

import type { CurrencyInputProps } from './CurrencyInput';
import { CurrencyInput } from './CurrencyInput';

type CurrencyInputValidationProps = Omit<CurrencyInputProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const CurrencyInputValidation: React.FC<CurrencyInputValidationProps> = ({
  name,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <CurrencyInput id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

import { useController, useFormContext } from 'react-hook-form';

import type { InputProps } from './Input';
import { Input } from './Input';

type InputValidationProps = Omit<InputProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const InputValidation: React.FC<InputValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <Input id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

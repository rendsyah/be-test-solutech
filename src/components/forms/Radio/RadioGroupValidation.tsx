import { useFormContext, useController } from 'react-hook-form';

import type { RadioGroupProps } from './RadioGroup';
import { RadioGroup } from './RadioGroup';

type RadioGroupValidationProps = Omit<RadioGroupProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const RadioGroupValidation: React.FC<RadioGroupValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <RadioGroup name={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

import { useController, useFormContext } from 'react-hook-form';

import type { CheckboxProps } from './Checkbox';
import { Checkbox } from './Checkbox';

type CheckboxValidationProps = Omit<CheckboxProps, 'onChange' | 'checked' | 'error'> & {
  name: string;
};

export const CheckboxValidation: React.FC<CheckboxValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: false,
  });

  return <Checkbox id={name} checked={value} error={!!error} onChange={onChange} {...props} />;
};

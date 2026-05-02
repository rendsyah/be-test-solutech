import { useController, useFormContext } from 'react-hook-form';

import type { SelectProps } from './Select';
import { Select } from './Select';

type SelectValidationProps = Omit<SelectProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const SelectValidation: React.FC<SelectValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <Select id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

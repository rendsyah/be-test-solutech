import { useController, useFormContext } from 'react-hook-form';

import type { ComboboxProps } from './Combobox';
import { Combobox } from './Combobox';

type ComboboxValidationProps = Omit<ComboboxProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const ComboboxValidation: React.FC<ComboboxValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  return <Combobox id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

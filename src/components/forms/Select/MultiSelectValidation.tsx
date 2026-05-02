import { useController, useFormContext } from 'react-hook-form';

import type { MultiSelectProps } from './MultiSelect';
import { MultiSelect } from './MultiSelect';

type MultiSelectValidationProps = Omit<MultiSelectProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const MultiSelectValidation: React.FC<MultiSelectValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  return <MultiSelect id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

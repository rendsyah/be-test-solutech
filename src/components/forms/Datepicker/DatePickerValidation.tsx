import { useController, useFormContext } from 'react-hook-form';

import type { DatePickerProps } from './DatePicker';
import { DatePicker } from './DatePicker';

type DatePickerValidationProps = Omit<DatePickerProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const DatePickerValidation: React.FC<DatePickerValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <DatePicker id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

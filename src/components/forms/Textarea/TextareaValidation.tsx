import { useController, useFormContext } from 'react-hook-form';

import type { TextareaProps } from './Textarea';
import { Textarea } from './Textarea';

type TextareaValidationProps = Omit<TextareaProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const TextareaValidation: React.FC<TextareaValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <Textarea id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

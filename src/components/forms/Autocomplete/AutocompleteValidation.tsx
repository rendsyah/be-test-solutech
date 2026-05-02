import { useController, useFormContext } from 'react-hook-form';

import type { AutocompleteProps } from './Autocomplete';
import { Autocomplete } from './Autocomplete';

type AutocompleteValidationProps = Omit<AutocompleteProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const AutocompleteValidation: React.FC<AutocompleteValidationProps> = ({
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

  return <Autocomplete id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

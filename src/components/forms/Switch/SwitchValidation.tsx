import { useController, useFormContext } from 'react-hook-form';

import type { SwitchProps } from './Switch';
import { Switch } from './Switch';

type SwitchValidationProps = Omit<SwitchProps, 'onChange' | 'checked' | 'error'> & {
  name: string;
};

export const SwitchValidation: React.FC<SwitchValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: false,
  });

  return <Switch id={name} checked={value} error={!!error} onChange={onChange} {...props} />;
};

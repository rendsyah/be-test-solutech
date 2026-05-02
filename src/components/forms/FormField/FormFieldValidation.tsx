import { useFormContext } from 'react-hook-form';

import type { FormFieldProps } from './FormField';
import { FormField } from './FormField';

type FormFieldValidationProps = Omit<FormFieldProps, 'error'> & {
  name: string;
};

export const FormFieldValidation: React.FC<FormFieldValidationProps> = ({ name, ...props }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  return <FormField id={name} error={error} {...props} />;
};

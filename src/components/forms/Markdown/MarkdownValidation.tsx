import { useController, useFormContext } from 'react-hook-form';

import type { MarkdownProps } from './Markdown';
import { Markdown } from './Markdown';

type MarkdownValidationProps = Omit<MarkdownProps, 'onChange' | 'value' | 'error'> & {
  name: string;
};

export const MarkdownValidation: React.FC<MarkdownValidationProps> = ({ name, ...props }) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  return <Markdown id={name} value={value} error={!!error} onChange={onChange} {...props} />;
};

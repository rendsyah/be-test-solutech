// FormField.tsx
import { cn } from '@/libs/utils';

import { Label } from '../Label';

export type FormFieldProps = {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  asFieldset?: boolean;
  addon?: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required,
  error,
  children,
  asFieldset,
  addon,
}) => {
  const Wrapper = asFieldset ? 'fieldset' : 'div';
  return (
    <Wrapper className={cn('flex flex-col gap-1.5', asFieldset && 'border-0 p-0 m-0 min-w-0')}>
      {label && (
        <Label
          {...(!asFieldset && { htmlFor: id })}
          asLegend={asFieldset}
          label={label}
          required={required}
        />
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1">{children}</div>
        {addon && <div className="shrink-0">{addon}</div>}
      </div>
      {error && (
        <p id={`${id}-error`} className="input-text-error">
          {error}
        </p>
      )}
    </Wrapper>
  );
};

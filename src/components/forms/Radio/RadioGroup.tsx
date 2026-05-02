import React from 'react';

import { cn } from '@/libs/utils';

import type { RadioButtonProps } from './RadioButton';

export type RadioGroupProps = {
  name: string;
  value?: string;
  className?: string;
  direction?: 'row' | 'column';
  error?: boolean;
  children: React.ReactNode;
  onChange?: (value: string) => void;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  className,
  direction = 'row',
  error,
  children,
  onChange,
}) => {
  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-invalid={!!error}
        aria-describedby={name && error ? `${name}-error` : undefined}
        className={cn('flex gap-4', direction === 'column' && 'flex-col')}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement<RadioButtonProps>(child)) return child;
          return React.cloneElement(child, {
            name,
            checked: String(child.props.value) === String(value),
            error: !!error,
            onChange,
          });
        })}
      </div>
    </div>
  );
};

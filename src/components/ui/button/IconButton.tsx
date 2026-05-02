import React from 'react';

import { cn } from '@/libs/utils';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton: React.FC<IconButtonProps> = ({
  type = 'button',
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'w-8 h-8 rounded-lg',
        'hover:bg-gray-100 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

import { useState } from 'react';

import { cn } from '@/libs/utils';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = {
  content: React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactNode;
  disabled?: boolean;
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  disabled,
}) => {
  const [visible, setVisible] = useState(false);

  const basePosition = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => !disabled && setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <div
        className={cn(
          'absolute z-50 whitespace-nowrap text-xs px-2 py-1 rounded-lg',
          'bg-gray-100 shadow-xs pointer-events-none',
          'transform transition-all duration-150 ease-out',
          basePosition[position],
          visible && !disabled ? 'opacity-100' : 'opacity-0',
        )}
      >
        {content}
      </div>
    </div>
  );
};

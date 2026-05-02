import * as RadixPopover from '@radix-ui/react-popover';

import { cn } from '@/libs/utils';

export type PopoverContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end' | 'center';
  matchTriggerWidth?: boolean;
};

export const PopoverRoot = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;

export const PopoverContent: React.FC<PopoverContentProps> = ({
  children,
  className,
  align = 'start',
  matchTriggerWidth = true,
}) => {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        sideOffset={4}
        align={align}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        style={matchTriggerWidth ? { width: 'var(--radix-popover-trigger-width)' } : undefined}
        className={cn(
          'bg-white border border-slate-200',
          'rounded-lg shadow-xs',
          'z-50 outline-none',
          className,
        )}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
};

import { useState, useRef, useCallback } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { PopoverRoot, PopoverTrigger, PopoverContent } from '@/components/ui';
import { cn } from '@/libs/utils';
import type { Options } from '@/types';

import { Checkbox } from '../Checkbox';

export type MultiSelectProps = {
  id?: string;
  value: string[];
  placeholder?: string;
  options: Options[];
  className?: string;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange: (value: string[]) => void;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  value,
  placeholder,
  options,
  className,
  error,
  readOnly,
  disabled,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selected = options.filter((o) => value.includes(String(o.id)));

  const label = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0].name;
    return `${selected.length} selected`;
  };

  const handleToggle = useCallback(
    (optId: string) => {
      if (disabled || readOnly) return;
      const exists = value.includes(optId);
      onChange(exists ? value.filter((v) => v !== optId) : [...value, optId]);
    },
    [disabled, readOnly, value, onChange],
  );

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (disabled || readOnly) return;
      setOpen(val);
      if (val) {
        setFocusedIndex(0);
      } else {
        setFocusedIndex(-1);
      }
    },
    [disabled, readOnly],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            handleOpenChange(true);
          } else {
            setFocusedIndex((prev) => {
              const next = prev < options.length - 1 ? prev + 1 : 0;
              optionRefs.current[next]?.scrollIntoView({ block: 'nearest' });
              return next;
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) {
            handleOpenChange(true);
          } else {
            setFocusedIndex((prev) => {
              const next = prev > 0 ? prev - 1 : options.length - 1;
              optionRefs.current[next]?.scrollIntoView({ block: 'nearest' });
              return next;
            });
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!open) {
            handleOpenChange(true);
          } else if (focusedIndex >= 0 && options[focusedIndex]) {
            handleToggle(String(options[focusedIndex].id));
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleOpenChange(false);
          break;
        case 'Tab':
          handleOpenChange(false);
          break;
      }
    },
    [disabled, readOnly, open, focusedIndex, options, handleOpenChange, handleToggle],
  );

  return (
    <PopoverRoot open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'input relative',
            'text-left cursor-pointer',
            selected.length === 0 && 'text-gray-400',
            disabled && 'cursor-not-allowed',
            error && 'input-error',
            className,
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
          aria-describedby={id && error ? `${id}-error` : undefined}
          disabled={disabled}
          onKeyDown={handleKeyDown}
        >
          {label()}
          <ChevronDownIcon
            className={cn(
              'absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gray-500',
              'transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <div
          role="listbox"
          aria-multiselectable="true"
          aria-label={placeholder}
          className="p-1 space-y-1 max-h-60 overflow-y-auto custom-scrollbar"
        >
          {options.length > 0 ? (
            options.map((opt, index) => {
              const isChecked = value.includes(String(opt.id));
              return (
                <div
                  key={opt.id}
                  id={`${id}-option-${index}`}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  role="option"
                  aria-selected={isChecked}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm cursor-pointer',
                    'hover:bg-gray-100 transition-colors',
                    focusedIndex === index && 'bg-gray-100',
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    label={opt.name}
                    readOnly={readOnly}
                    disabled={disabled}
                    onChange={() => handleToggle(String(opt.id))}
                  />
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm select-none">No options available</div>
          )}
        </div>
      </PopoverContent>
    </PopoverRoot>
  );
};

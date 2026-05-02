import { useState } from 'react';

import { ChevronDownIcon } from '@/components/icons';
import { PopoverRoot, PopoverAnchor, PopoverContent } from '@/components/ui';
import { cn } from '@/libs/utils';
import type { Options } from '@/types';

export type AutocompleteProps = {
  id?: string;
  value: string;
  placeholder?: string;
  options: Options[];
  className?: string;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
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
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find((o) => String(o.id) === String(value)) || null;
  const displayValue = open ? search : (selected?.name ?? '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setActiveIndex(-1);
    setOpen(true);
  };

  const handleSelect = (opt: Options) => {
    onChange(String(opt.id));
    setSearch('');
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleOpenChange = (val: boolean) => {
    if (disabled || readOnly) return;
    if (!val) setSearch('');
    setOpen(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleSelect(filtered[activeIndex]);
        }
        break;
      case 'Escape':
        setOpen(false);
        setSearch('');
        break;
      case 'Tab':
        setOpen(false);
        setSearch('');
        break;
    }
  };

  return (
    <PopoverRoot open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <input
            id={id}
            type="text"
            value={displayValue}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `option-${filtered[activeIndex]?.id}` : undefined
            }
            aria-describedby={id && error ? `${id}-error` : undefined}
            className={cn(
              'input pr-10',
              disabled && 'cursor-not-allowed',
              error && 'input-error',
              className,
            )}
            onChange={handleInputChange}
            onFocus={() => !readOnly && !disabled && setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          <ChevronDownIcon
            className={cn(
              'pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gray-500',
              'transition-transform',
              open && 'rotate-180',
            )}
          />
        </div>
      </PopoverAnchor>

      <PopoverContent>
        <div role="listbox" className="p-1 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
          {filtered.length > 0 ? (
            filtered.map((opt, index) => (
              <div
                key={opt.id}
                id={`option-${opt.id}`}
                role="option"
                aria-selected={selected?.id === opt.id}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm cursor-pointer',
                  'hover:bg-gray-100 transition-colors',
                  selected?.id === opt.id && 'bg-primary text-white hover:bg-primary',
                  activeIndex === index && selected?.id !== opt.id && 'bg-gray-100',
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
              >
                {opt.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm select-none">No results found</div>
          )}
        </div>
      </PopoverContent>
    </PopoverRoot>
  );
};

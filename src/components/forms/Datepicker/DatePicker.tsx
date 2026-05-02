import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useState } from 'react';

import { Input } from '@/components/forms/Input/Input';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { PopoverRoot, PopoverTrigger, PopoverContent } from '@/components/ui';
import { cn } from '@/libs/utils';

import { Day } from './Day';
import { Year } from './Year';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export type DatePickerProps = {
  id?: string;
  value: string;
  placeholder?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (date: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  placeholder,
  className,
  value,
  minDate,
  maxDate,
  format = 'YYYY-MM-DD',
  error,
  readOnly,
  disabled,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'date' | 'year'>('date');
  const [currentMonth, setCurrentMonth] = useState(dayjs(value || new Date()));

  const onNextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'));
  const onPrevMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'));

  const handleOpenChange = (val: boolean) => {
    if (disabled || readOnly) return;
    if (val && value) setCurrentMonth(dayjs(value));
    setViewMode('date');
    setOpen(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenChange(!open);
    }
  };

  return (
    <PopoverRoot open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="w-full cursor-pointer" onKeyDown={handleKeyDown}>
          <Input
            id={id}
            className={cn('cursor-pointer', className)}
            value={value}
            placeholder={placeholder}
            icon={<CalendarIcon className="size-5" />}
            iconPosition="end"
            error={error}
            readOnly={readOnly}
            disabled={disabled}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        matchTriggerWidth={false}
        className="w-full sm:w-fit sm:min-w-60 sm:max-w-[260px] p-0"
      >
        <div className="flex justify-between items-center py-3 px-4">
          <button type="button" className="rounded-full" onClick={onPrevMonth}>
            <ChevronLeftIcon className="size-4 text-gray-500" />
          </button>
          <button
            type="button"
            className="font-semibold text-sm rounded-md px-1"
            onClick={() => setViewMode((prev) => (prev === 'date' ? 'year' : 'date'))}
          >
            {currentMonth.format('MMMM YYYY')}
          </button>
          <button type="button" className="rounded-full" onClick={onNextMonth}>
            <ChevronRightIcon className="size-4 text-gray-500" />
          </button>
        </div>

        {viewMode === 'year' ? (
          <Year
            currentYear={currentMonth.year()}
            minDate={minDate}
            maxDate={maxDate}
            onSelect={(year) => {
              setCurrentMonth(currentMonth.year(year));
              setViewMode('date');
            }}
          />
        ) : (
          <Day
            currentMonth={currentMonth}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            format={format}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onClose={() => setOpen(false)}
            onChange={(value) => {
              onChange?.(value);
              setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </PopoverRoot>
  );
};

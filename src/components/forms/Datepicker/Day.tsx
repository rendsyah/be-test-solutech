import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/libs/utils';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type DayProps = {
  currentMonth: dayjs.Dayjs;
  value: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClose: () => void;
  onChange: (date: string) => void;
};

export const Day: React.FC<DayProps> = ({
  currentMonth,
  value,
  minDate,
  maxDate,
  format,
  onChange,
  onPrevMonth,
  onNextMonth,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = currentMonth.daysInMonth();
  const startOfMonth = currentMonth.startOf('month').day();

  const [focusedDate, setFocusedDate] = useState<dayjs.Dayjs>(() => {
    const base = value ? dayjs(value) : dayjs();
    const day = Math.min(base.date(), currentMonth.daysInMonth());
    return currentMonth.date(day);
  });

  const safeFocusedDate = useMemo(() => {
    const max = currentMonth.daysInMonth();
    const day = Math.min(focusedDate.date(), max);
    return currentMonth.date(day);
  }, [currentMonth, focusedDate]);

  const dates = useMemo(() => {
    const length = startOfMonth + daysInMonth;
    return Array.from({ length }, (_, i) =>
      i < startOfMonth ? null : currentMonth.date(i - startOfMonth + 1),
    );
  }, [currentMonth, daysInMonth, startOfMonth]);

  const isSelected = (d: dayjs.Dayjs) => (value ? dayjs(value).isSame(d, 'day') : false);
  const isToday = (d: dayjs.Dayjs) => d.isSame(dayjs(), 'day');
  const isInRange = (d: dayjs.Dayjs) => {
    const afterMin = minDate ? d.isSameOrAfter(dayjs(minDate), 'day') : true;
    const beforeMax = maxDate ? d.isSameOrBefore(dayjs(maxDate), 'day') : true;
    return afterMin && beforeMax;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const next = safeFocusedDate.add(1, 'day');
        setFocusedDate(next);
        if (next.month() !== currentMonth.month()) onNextMonth();
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const next = safeFocusedDate.subtract(1, 'day');
        setFocusedDate(next);
        if (next.month() !== currentMonth.month()) onPrevMonth();
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const next = safeFocusedDate.add(1, 'week');
        setFocusedDate(next);
        if (next.month() !== currentMonth.month()) onNextMonth();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const next = safeFocusedDate.subtract(1, 'week');
        setFocusedDate(next);
        if (next.month() !== currentMonth.month()) onPrevMonth();
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isInRange(safeFocusedDate)) {
          onChange(safeFocusedDate.format(format));
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className="px-3 pb-3 focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {dates.map((date, idx) => {
          const focused = date && date.isSame(safeFocusedDate, 'day');
          const selected = date && isSelected(date);
          const today = date && isToday(date);
          const disabled = !date || !isInRange(date);

          return (
            <button
              type="button"
              key={idx}
              tabIndex={-1}
              onClick={() => date && !disabled && onChange(date.format(format))}
              disabled={disabled}
              className={cn(
                'size-8 rounded-full flex items-center justify-center transition-colors',
                focused && !selected && 'ring-1 ring-primary',
                !selected && today && !disabled && 'ring-1 ring-primary',
                !selected && !disabled && 'hover:bg-primary hover:text-white',
                selected && 'bg-primary text-white',
                disabled && 'text-gray-400 cursor-not-allowed',
              )}
            >
              {date?.date() || ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

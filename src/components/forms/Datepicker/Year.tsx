import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

import { cn } from '@/libs/utils';

type YearProps = {
  currentYear: number;
  minDate?: string;
  maxDate?: string;
  onSelect: (year: number) => void;
};

const START_YEAR = 1900;
const YEAR_COUNT = 200;

export const Year: React.FC<YearProps> = ({ currentYear, minDate, maxDate, onSelect }) => {
  const activeYearRef = useRef<HTMLButtonElement>(null);
  const years = Array.from({ length: YEAR_COUNT }, (_, i) => START_YEAR + i);

  const isYearDisabled = (year: number) => {
    const beforeMin = minDate ? dayjs(`${year}-01-01`).isBefore(dayjs(minDate), 'year') : false;
    const afterMax = maxDate ? dayjs(`${year}-12-31`).isAfter(dayjs(maxDate), 'year') : false;
    return beforeMin || afterMax;
  };

  useEffect(() => {
    if (activeYearRef.current) {
      activeYearRef.current.scrollIntoView({ block: 'center' });
    }
  }, []);

  return (
    <div className="max-h-48 px-3 pt-1 pb-3 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-3 gap-1 text-sm">
        {years.map((year) => {
          const isDisabled = isYearDisabled(year);
          const isActive = year === currentYear;
          return (
            <button
              type="button"
              key={year}
              ref={isActive ? activeYearRef : null}
              onClick={() => !isDisabled && onSelect(year)}
              disabled={isDisabled}
              className={cn(
                'w-full py-1.5 rounded-lg',
                'hover:bg-primary hover:text-white transition-colors',
                isActive && !isDisabled && 'bg-primary text-white',
                isDisabled && 'text-gray-400 cursor-not-allowed',
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
};

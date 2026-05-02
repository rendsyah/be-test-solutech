import { useState } from 'react';

import { AreaChart } from '@/components/charts';
import { cn } from '@/libs/utils';

type Period = 'daily' | 'weekly' | 'monthly';

const MOCK_DATA: Record<
  Period,
  { categories: string[]; series: { name: string; data: number[] }[] }
> = {
  daily: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Income', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Expense', data: [11, 32, 45, 32, 34, 52, 41] },
    ],
  },
  weekly: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    series: [
      { name: 'Income', data: [400, 300, 500, 450] },
      { name: 'Expense', data: [200, 250, 150, 300] },
    ],
  },
  monthly: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: [
      {
        name: 'Income',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 500)),
      },
      {
        name: 'Expense',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 400)),
      },
    ],
  },
};

export const DashboardStatistic: React.FC = () => {
  const [period, setPeriod] = useState<Period>('monthly');

  const current = MOCK_DATA[period];

  const tabs: { label: string; value: Period }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.value === period);

  return (
    <div className="card min-h-105.25 px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold capitalize">{period} Statistic</h3>
          <p className="mt-0.5 text-gray-400 text-xs">
            Statistic based on your {period} performance
          </p>
        </div>

        <div className="relative flex bg-gray-100/60 p-1 rounded-xl w-full sm:w-64">
          <div
            className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-white rounded-lg shadow-xs border border-slate-100"
            style={{
              width: `calc(100% / ${tabs.length} - 8px)`,
              left: `calc((${activeIndex} * 100% / ${tabs.length}) + 4px)`,
            }}
          />

          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setPeriod(tab.value)}
              className={cn(
                'relative z-10 flex-1 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-300',
                period === tab.value ? 'text-inherit' : 'text-gray-500 hover:text-gray-600',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div className="min-w-250 xl:min-w-full">
          <AreaChart
            height={310}
            colors={['#7688C9', '#64D1C1']}
            categories={current.categories}
            series={current.series}
          />
        </div>
      </div>
    </div>
  );
};

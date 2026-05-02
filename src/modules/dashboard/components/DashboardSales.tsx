import { useState } from 'react';

import { BarChart } from '@/components/charts';
import { cn } from '@/libs/utils';

type Period = 'daily' | 'weekly' | 'monthly';

const MOCK_DATA: Record<
  Period,
  {
    categories: string[];
    series: {
      name: string;
      data: number[];
    }[];
  }
> = {
  daily: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Sales', data: [120, 250, 450, 200, 300, 150, 280] },
      { name: 'Profit', data: [80, 150, 300, 120, 200, 90, 180] },
    ],
  },
  weekly: {
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    series: [
      { name: 'Sales', data: [1200, 1500, 900, 1800] },
      { name: 'Profit', data: [800, 1000, 600, 1200] },
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
        name: 'Sales',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 500)),
      },
      {
        name: 'Profit',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 300)),
      },
    ],
  },
};

export const DashboardSales: React.FC = () => {
  const [period, setPeriod] = useState<Period>('monthly');

  const currentData = MOCK_DATA[period];

  const tabs: { label: string; value: Period }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.value === period);

  return (
    <div className="card min-h-71.75 overflow-hidden px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h3 className="text-lg font-semibold capitalize">{period} Sales</h3>

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
        <div className="min-w-162.5 xl:min-w-full">
          <BarChart
            height={200}
            colors={['#7688C9', '#64D1C1']}
            categories={currentData.categories}
            series={currentData.series}
          />
        </div>
      </div>
    </div>
  );
};

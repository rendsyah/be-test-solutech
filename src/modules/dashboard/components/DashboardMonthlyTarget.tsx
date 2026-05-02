import CountUp from 'react-countup';

import { RadialBarChart } from '@/components/charts';
import { ChevronDownIcon, EllipsisVerticalIcon } from '@/components/icons';
import { Badge, IconButton } from '@/components/ui';

const categories = ['Progress'];
const data = {
  categories,
  series: [
    {
      name: 'Progress',
      data: [72.25],
    },
  ],
};

export const DashboardMonthlyTarget: React.FC = () => {
  return (
    <div className="card sm:min-h-121.25">
      <div className="bg-gray-50 sm:min-h-97.75 rounded-2xl px-5 pt-5 pb-8 sm:px-6 sm:pt-6">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Monthly Target</h3>
            <p className="mt-0.5 text-gray-400 text-xs">Target you’ve set for each month</p>
          </div>

          <div className="relative inline-block">
            <IconButton>
              <EllipsisVerticalIcon className="size-6" />
            </IconButton>
          </div>
        </div>

        <div className="relative">
          <div className="sm:h-48">
            <RadialBarChart
              height={403}
              colors={['#6366F1']}
              categories={data.categories}
              series={data.series}
            />
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-[-80%]">
            <Badge color="success" size="sm">
              +10%
            </Badge>
          </div>
        </div>
        <p className="mx-auto mt-10 w-full max-w-95 text-center text-xs sm:text-sm text-gray-400">
          You earn $3287 today, it&apos;s higher than last month. Keep up your good work!
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-3.5 gap-5 sm:gap-8 sm:py-5">
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Target</p>
          <p className="flex items-center justify-center gap-2 text-base font-semibold sm:text-lg">
            <CountUp prefix="$" end={70} duration={1.5} />
            <ChevronDownIcon className="size-4 text-red-500" />
          </p>
        </div>

        <div className="w-px h-8 bg-slate-200"></div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Revenue</p>
          <p className="flex items-center justify-center gap-2 text-base font-semibold sm:text-lg">
            <CountUp prefix="$" end={100} duration={1.5} />
            <ChevronDownIcon className="size-4 text-green-500 rotate-180" />
          </p>
        </div>

        <div className="w-px h-8 bg-slate-200"></div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm">Today</p>
          <p className="flex items-center justify-center gap-2 text-base font-semibold sm:text-lg">
            <CountUp prefix="$" end={20} duration={1.5} />
            <ChevronDownIcon className="size-4 text-red-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

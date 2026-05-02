import CountUp from 'react-countup';

import { SparklineChart } from '@/components/charts';
import { BankNotesIcon, ShoppingCartIcon } from '@/components/icons';

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = {
  categories,
  series: [
    {
      name: 'Income',
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50)),
    },
  ],
  series2: [
    {
      name: 'Transaction',
      data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50)),
    },
  ],
};

export const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="card min-h-43.5 p-5 md:p-6">
        <div className="flex justify-between">
          <div>
            <div className="mb-10">
              <BankNotesIcon className="size-6" />
            </div>

            <div>
              <span className="text-sm text-gray-400">Income</span>
              <CountUp
                prefix="$"
                end={10980}
                duration={1.5}
                className="block mt-1 font-semibold text-2xl"
              />
            </div>
          </div>

          <div className="flex items-center">
            <SparklineChart
              height={50}
              width={150}
              colors={['#7688C9']}
              categories={data.categories}
              series={data.series}
            />
          </div>
        </div>
      </div>

      <div className="card min-h-43.5 p-5 md:p-6">
        <div className="flex justify-between">
          <div>
            <div className="mb-10">
              <ShoppingCartIcon className="size-6" />
            </div>

            <div>
              <span className="text-sm text-gray-400">Transaction</span>
              <CountUp end={3782} duration={1.5} className="block mt-1 font-semibold text-2xl" />
            </div>
          </div>

          <div className="flex items-center">
            <SparklineChart
              height={50}
              width={150}
              colors={['#94A3B8']}
              categories={data.categories}
              series={data.series2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

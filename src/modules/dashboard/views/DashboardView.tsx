'use client';

import {
  DashboardHeader,
  DashboardMetrics,
  DashboardMonthlyTarget,
  DashboardSales,
  DashboardStatistic,
} from '../components';

export const DashboardView = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <DashboardHeader />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <DashboardMetrics />
        <DashboardSales />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <DashboardMonthlyTarget />
      </div>
      <div className="col-span-12">
        <DashboardStatistic />
      </div>
    </div>
  );
};

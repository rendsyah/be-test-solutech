import dynamic from 'next/dynamic';

import type { ChartProps } from './types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const SparklineChart: React.FC<ChartProps> = ({
  height = 50,
  width = 100,
  colors,
  categories,
  series,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      fontFamily: 'Poppins, sans-serif',
      height,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    grid: {
      show: false,
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    },
    xaxis: {
      categories,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    colors,
    series,
  };

  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="line"
      height={height}
      width={width}
    />
  );
};

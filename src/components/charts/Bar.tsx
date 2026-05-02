import dynamic from 'next/dynamic';

import type { ChartProps } from './types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const BarChart: React.FC<ChartProps> = ({
  height = 300,
  width = '100%',
  colors,
  categories,
  series,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: 'Poppins, sans-serif',
      height,
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value) => `${value}`,
      },
    },
    colors,
    series,
  };

  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="bar"
      height={height}
      width={width}
    />
  );
};

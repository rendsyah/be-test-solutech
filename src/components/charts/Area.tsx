import dynamic from 'next/dynamic';

import type { ChartProps } from './types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const AreaChart: React.FC<ChartProps> = ({
  height = 300,
  width = '100%',
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
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: 'dd MMM yyyy',
      },
    },
    stroke: {
      curve: 'smooth',
      width: [2, 2],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: ['#6B7280'],
        },
      },
      title: {
        text: undefined,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    colors,
    series,
  };

  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="area"
      height={height}
      width={width}
    />
  );
};

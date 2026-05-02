import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import type { ChartProps } from './types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const RadialBarChart: React.FC<ChartProps> = ({
  height = 300,
  width = '100%',
  colors,
  categories,
  series,
}) => {
  const chartSeries = useMemo(() => {
    return series.flatMap((s) => s.data);
  }, [series]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radialBar',
      fontFamily: 'Poppins, sans-serif',
      height,
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: '75%',
        },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '30px',
            fontWeight: '600',
            offsetY: -40,
            formatter: (value) => {
              return value + '%';
            },
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors,
    },
    stroke: {
      lineCap: 'round',
    },
    colors,
    series: chartSeries,
    labels: categories,
  };

  return (
    <ReactApexChart
      options={options}
      series={chartSeries}
      type="radialBar"
      height={height}
      width={width}
    />
  );
};

type Series = {
  name: string;
  data: number[];
};

export type ChartProps = {
  height?: string | number;
  width?: string | number;
  colors?: string[];
  categories: string[];
  series: Series[];
};

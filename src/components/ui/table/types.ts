export type ColumnDef<T> = {
  key: string;
  label: string;
  className?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render: (value: T) => React.ReactNode;
};

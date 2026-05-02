export const formatCapitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatCurrency = (value: string | number) => {
  if (value === '' || value === null || value === undefined) return '';
  const numeric = value.toString().replace(/\D/g, '');
  if (numeric === '') return '';
  return new Intl.NumberFormat('id-ID').format(Number(numeric));
};

export const parseCurrency = (value: string | number) => {
  if (value === '' || value === null || value === undefined) return '';
  return value.toString().replace(/\D/g, '');
};

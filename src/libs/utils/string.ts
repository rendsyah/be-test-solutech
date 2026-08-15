export const toOptionalString = (value: string | null | undefined): string | undefined => {
  if (!value || value.length === 0) return undefined;
  return value;
};

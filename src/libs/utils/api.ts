import { API } from '../constants';

export const buildParams = (
  obj: Record<string, unknown>,
  removeStr = true,
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (removeStr && value === '') return false;
        return true;
      })
      .map(([key, value]) => [key, String(value)]),
  );
};

export const buildURL = (
  base: string,
  path: string,
  params?: Record<string, string | number | boolean>,
) => {
  const cleanPath = path.replace(/^\/+/, '');
  const url = `${base}/${cleanPath}`;

  if (!params) return url;

  const filtered = buildParams(params);
  const query = new URLSearchParams(filtered).toString();

  return query ? `${url}?${query}` : url;
};

export const isAllowedPath = (path: string) => {
  return API.ALLOWED_PATHS.some((allowed) => path.startsWith(allowed));
};

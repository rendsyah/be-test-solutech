import { isAxiosError } from 'axios';

import { HTTP_STATUS } from '@/libs/constants';
import type { ApiResponse } from '@/types';

const safeJson = async <T>(res: Response): Promise<T | null> => {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

export const normalizeApiResponse = <T>(
  status: number,
  body: ApiResponse<T> | null,
  fallbackMessage: string,
  success = false,
): ApiResponse<T> => ({
  status,
  success: body?.success ?? success,
  data: body?.data ?? (null as T),
  message: body?.message ?? fallbackMessage,
  errors: (body?.errors as []) ?? [],
  trace_id: body?.trace_id ?? '',
});

export const handleAxiosError = async <T = unknown>(error: unknown): Promise<ApiResponse<T>> => {
  if (!isAxiosError(error)) {
    return normalizeApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, null, 'Unexpected error');
  }

  if (error.code === 'ECONNABORTED') {
    return normalizeApiResponse(HTTP_STATUS.GATEWAY_TIMEOUT, null, 'Request timeout');
  }

  if (!error.response) {
    return normalizeApiResponse(HTTP_STATUS.SERVICE_UNAVAILABLE, null, 'Service unavailable');
  }

  return normalizeApiResponse<T>(
    error.response.status,
    error.response.data,
    'An unexpected error occurred',
  );
};

export const handleFetchError = async <T = unknown>(res: Response): Promise<ApiResponse<T>> => {
  const body = await safeJson<ApiResponse<T>>(res);
  return normalizeApiResponse<T>(
    res.status,
    body,
    res.statusText || 'An unexpected error occurred',
  );
};

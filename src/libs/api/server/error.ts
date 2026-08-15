import type { ApiResponse } from '@/types';

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

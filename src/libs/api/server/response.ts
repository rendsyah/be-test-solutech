import { randomUUID } from 'crypto';

import { HTTP_STATUS } from '@/libs/constants';
import type { ApiResponse } from '@/types';

export const successResponse = <T>(
  data: T,
  message = 'Success',
  status = HTTP_STATUS.OK,
): ApiResponse<T> => ({
  status,
  success: true,
  message,
  data,
  errors: [],
  trace_id: randomUUID(),
});

export const errorResponse = (
  status: number,
  message: string,
  errors: unknown[] = [],
): ApiResponse<null> => ({
  status,
  success: false,
  message,
  data: null,
  errors,
  trace_id: randomUUID(),
});

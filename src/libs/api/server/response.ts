import { HTTP_STATUS } from '@/libs/constants';
import type { ApiError, ApiResponse } from '@/types';

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
});

export const errorResponse = (
  status: number,
  message: string,
  errors: ApiError[] = [],
): ApiResponse<null> => ({
  status,
  success: false,
  message,
  data: null,
  errors,
});

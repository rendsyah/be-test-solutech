import { redirect } from 'next/navigation';

import { APP, HTTP_STATUS } from '@/libs/constants';
import type { ApiResponse } from '@/types';

import { handleAxiosError } from './error';

export const callService = async <T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const unwrapResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      redirect(APP.SESSION_EXPIRED_URL);
    }
    throw new Error(response.message);
  }
  return response.data;
};

import { AppError } from '@/libs/utils';
import type { ActionState, ApiResponse } from '@/types';

import { errorResponse } from './response';

export const withAction = <TArgs extends unknown[], R = unknown>(
  action: (...args: TArgs) => Promise<ApiResponse<R>>,
): ((...args: TArgs) => Promise<ActionState<R>>) => {
  return async (...args) => {
    try {
      return await action(...args);
    } catch (error) {
      if (error instanceof AppError) {
        return errorResponse(
          error.status,
          error.message,
          error.errors,
        ) as unknown as ActionState<R>;
      }
      throw error;
    }
  };
};

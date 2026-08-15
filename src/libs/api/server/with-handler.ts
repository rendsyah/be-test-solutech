import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from '@/libs/logger';
import { AppError } from '@/libs/utils';
import type { ApiResponse } from '@/types';

import { errorResponse } from './response';

type HandlerContext = { params: Promise<Record<string, string | string[] | undefined>> };

type ApiHandler<TRequest, C extends HandlerContext> = (
  req: TRequest,
  ctx: C,
) => Promise<ApiResponse<unknown>>;

export const withApiHandler = <
  TRequest extends Request = Request,
  C extends HandlerContext = HandlerContext,
>(
  handler: ApiHandler<TRequest, C>,
): ((req: TRequest, ctx: C) => Promise<NextResponse>) => {
  return async (req, ctx) => {
    const startedAt = Date.now();
    const method = req.method;
    const url = req.url;

    try {
      const response = await handler(req, ctx);
      logger.info('api request', {
        method,
        url,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return NextResponse.json(response, { status: response.status });
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn('api error', {
          method,
          url,
          status: error.status,
          message: error.message,
          durationMs: Date.now() - startedAt,
        });
        const body = errorResponse(error.status, error.message, error.errors);
        return NextResponse.json(body, { status: body.status });
      }

      if (error instanceof z.ZodError) {
        logger.warn('validation error', {
          method,
          url,
          errors: error.flatten().fieldErrors,
          durationMs: Date.now() - startedAt,
        });
        const errors = [error.flatten().fieldErrors] as unknown[];
        const body = errorResponse(400, 'Validation failed', errors);
        return NextResponse.json(body, { status: body.status });
      }

      logger.error('unhandled error', {
        method,
        url,
        error: error instanceof Error ? error.stack : String(error),
        durationMs: Date.now() - startedAt,
      });
      const body = errorResponse(500, 'An unexpected error occurred');
      return NextResponse.json(body, { status: body.status });
    }
  };
};

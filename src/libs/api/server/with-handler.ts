import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from '@/libs/logger';
import { AppError } from '@/libs/utils';
import type { ApiError, ApiResponse } from '@/types';

import { errorResponse } from './response';

type HandlerContext = { params: Promise<Record<string, string | string[] | undefined>> };

type ApiHandler<TRequest, C extends HandlerContext> = (
  req: TRequest,
  ctx: C,
) => Promise<ApiResponse<unknown>>;

const withTraceId = <T>(body: ApiResponse<T>): ApiResponse<T> => ({
  ...body,
  trace_id: randomUUID(),
});

const toApiErrors = (error: z.ZodError): ApiError[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
};

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
      const body = withTraceId(response);
      return NextResponse.json(body, { status: body.status });
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn('api error', {
          method,
          url,
          status: error.status,
          message: error.message,
          durationMs: Date.now() - startedAt,
        });
        const body = withTraceId(errorResponse(error.status, error.message, error.errors));
        return NextResponse.json(body, { status: body.status });
      }

      if (error instanceof z.ZodError) {
        logger.warn('validation error', {
          method,
          url,
          errors: error.flatten().fieldErrors,
          durationMs: Date.now() - startedAt,
        });
        const body = withTraceId(errorResponse(400, 'Validation failed', toApiErrors(error)));
        return NextResponse.json(body, { status: body.status });
      }

      logger.error('unhandled error', {
        method,
        url,
        error: error instanceof Error ? error.stack : String(error),
        durationMs: Date.now() - startedAt,
      });
      const body = withTraceId(errorResponse(500, 'An unexpected error occurred'));
      return NextResponse.json(body, { status: body.status });
    }
  };
};

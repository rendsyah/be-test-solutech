import { isAxiosError } from 'axios';
import type { NextRequest, NextResponse } from 'next/server';

import { HTTP_STATUS } from '@/libs/constants';
import { getSession } from '@/libs/session';
import { isAllowedPath } from '@/libs/utils';
import { AppError } from '@/libs/utils/errors';

import { normalizeApiResponse, handleAxiosError, handleFetchError } from './error';

type BaseContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

type Handler<TContext = BaseContext> = (
  req: NextRequest,
  ctx: TContext,
) => Promise<NextResponse | Response>;

export const errorResponse = (status: number, message: string) => {
  return Response.json(normalizeApiResponse(status, null, message), { status });
};

export const withHandler = <TContext extends BaseContext>(
  handler: Handler<TContext>,
): Handler<TContext> => {
  return async (req, ctx) => {
    try {
      const site = req.headers.get('sec-fetch-site');
      const origin = req.headers.get('origin') || req.headers.get('referer');
      const host = req.headers.get('host');

      if (!site || site !== 'same-origin') {
        throw AppError.forbidden();
      }

      if (!origin || !host || !origin.includes(host)) {
        throw AppError.forbidden();
      }

      const params = await ctx.params;
      if (params && 'route' in params && params.route) {
        const path = Array.isArray(params.route) ? params.route.join('/') : params.route;
        if (!isAllowedPath(path)) {
          throw AppError.forbidden();
        }
      }

      const session = await getSession();
      if (!session.token) {
        throw AppError.unauthorized();
      }

      return await handler(req, ctx);
    } catch (error) {
      console.error('[withHandler]', req.method, req.url, error);
      if (error instanceof AppError) {
        return errorResponse(error.status, error.message);
      }
      if (error instanceof Response) {
        const normalized = await handleFetchError(error);
        return Response.json(normalized, { status: normalized.status });
      }
      if (isAxiosError(error)) {
        const normalized = await handleAxiosError(error);
        return Response.json(normalized, { status: normalized.status });
      }
      return errorResponse(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  };
};

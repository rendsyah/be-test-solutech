import { NextResponse } from 'next/server';

import { externalFetch } from '@/libs/api/server';
import { API, HTTP_STATUS } from '@/libs/constants';
import { ENV } from '@/libs/env';

export const dynamic = 'force-dynamic';

async function handler(req: Request, { params }: { params: Promise<{ filename: string[] }> }) {
  const { filename } = await params;
  const path = '/assets/' + filename.filter(Boolean).join('/');

  if (API.INVALID_PATH_PATTERNS.some((pattern) => path.includes(pattern))) {
    return new NextResponse(null, { status: HTTP_STATUS.FORBIDDEN });
  }

  try {
    const response = await externalFetch(path, {
      baseURL: ENV.API_BASE_URL,
      cache: 'no-cache',
    });

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');

    return new NextResponse(response.body, { status: response.status, headers });
  } catch {
    return new NextResponse(null, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

export const GET = handler;

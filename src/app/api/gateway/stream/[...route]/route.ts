import { NextResponse } from 'next/server';

import { externalFetch } from '@/libs/api/server';
import { APP, HTTP_STATUS } from '@/libs/constants';
import { getSession } from '@/libs/session';
import { isAllowedPath } from '@/libs/utils';

export const dynamic = 'force-dynamic';

const handler = async (req: Request, { params }: { params: Promise<{ route: string[] }> }) => {
  const session = await getSession();
  if (!session.token) {
    return NextResponse.redirect(new URL(APP.SESSION_EXPIRED_URL, req.url));
  }

  const { route } = await params;
  const path = route.join('/');
  if (!isAllowedPath(path)) {
    return new Response(null, { status: HTTP_STATUS.FORBIDDEN });
  }

  const url = `${path}${new URL(req.url).search}`;
  const response = await externalFetch(url, {
    method: req.method,
  });

  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    return NextResponse.redirect(new URL(APP.SESSION_EXPIRED_URL, req.url));
  }

  return new Response(response.body, {
    status: response.status,
    headers: new Headers(response.headers),
  });
};

export const GET = handler;

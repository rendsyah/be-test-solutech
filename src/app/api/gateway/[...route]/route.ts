import type { NextRequest } from 'next/server';

import { externalAPI, withHandler } from '@/libs/api/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const handler = async (req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) => {
  const { route } = await params;
  const path = route.join('/');

  const response = await externalAPI({
    method: req.method,
    url: path,
    params: Object.fromEntries(new URL(req.url).searchParams),
    data: req.method !== 'GET' ? await req.json() : undefined,
  });

  return Response.json(response.data, { status: response.status });
};

export const GET = withHandler(handler);
export const POST = withHandler(handler);
export const PUT = withHandler(handler);
export const PATCH = withHandler(handler);
export const DELETE = withHandler(handler);

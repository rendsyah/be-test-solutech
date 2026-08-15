import { headers } from 'next/headers';

import { getSession } from '@/libs/session';
import { AppError } from '@/libs/utils';

import type { JwtPayload } from './jwt';
import { verifyJwt } from './jwt';

export const getAuthUser = async (): Promise<JwtPayload> => {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  let token: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    const session = await getSession();
    token = session.token ?? null;
  }

  if (!token) {
    throw AppError.unauthorized();
  }

  try {
    return await verifyJwt(token);
  } catch {
    throw AppError.unauthorized();
  }
};

export const requireAuth = getAuthUser;

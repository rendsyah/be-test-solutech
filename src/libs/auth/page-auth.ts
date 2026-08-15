import { redirect } from 'next/navigation';

import { APP, HTTP_STATUS } from '@/libs/constants';
import { AppError } from '@/libs/utils';

import { getAuthUser } from './guard';
import type { JwtPayload } from './jwt';

/**
 * Guard untuk halaman/RSC. Mirip `requireAuth` untuk API, namun jika sesi
 * tidak valid/kadaluarsa, redirect ke halaman login (bukan melempar error).
 */
export const requirePageAuth = async (): Promise<JwtPayload> => {
  try {
    return await getAuthUser();
  } catch (error) {
    if (error instanceof AppError && error.status === HTTP_STATUS.UNAUTHORIZED) {
      redirect(APP.SESSION_EXPIRED_URL);
    }
    throw error;
  }
};

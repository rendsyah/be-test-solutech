import type { SessionOptions } from 'iron-session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { APP } from './constants';
import { ENV } from './env';

export type SessionData = {
  token: string;
  redirectTo: string;
  isLogin: boolean;
};

export const sessionOptions: SessionOptions = {
  cookieName: APP.SESSION_NAME,
  password: ENV.SESSION_SECRET,
  cookieOptions: {
    secure: ENV.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export const getSession = async () => {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
};

export const setSession = async (token: string, redirectTo: string) => {
  const session = await getSession();
  session.token = token;
  session.redirectTo = redirectTo;

  await session.save();
  return session;
};

export const deleteSession = async () => {
  const session = await getIronSession(await cookies(), sessionOptions);
  session.destroy();
};

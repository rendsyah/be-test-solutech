import { jwtVerify, SignJWT } from 'jose';

import { ENV } from '@/libs/env';

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const secretKey = new TextEncoder().encode(ENV.JWT_SECRET);

export const signJwt = async (payload: JwtPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ENV.JWT_EXPIRES_IN)
    .sign(secretKey);
};

export const verifyJwt = async (token: string): Promise<JwtPayload> => {
  const { payload } = await jwtVerify(token, secretKey);
  const userId = payload.userId;
  const email = payload.email;
  const role = payload.role;

  if (!userId || !email || !role) {
    throw new Error('Invalid token payload');
  }

  return {
    userId: String(userId),
    email: String(email),
    role: String(role),
  };
};

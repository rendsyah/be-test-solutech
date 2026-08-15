import { jwtVerify, SignJWT } from 'jose';

import { ENV } from '@/libs/env';
import { AppError } from '@/libs/utils';

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
  let payload;

  try {
    ({ payload } = await jwtVerify(token, secretKey));
  } catch {
    throw AppError.unauthorized();
  }

  const userId = payload.userId;
  const email = payload.email;
  const role = payload.role;

  if (!userId || !email || !role) {
    throw AppError.unauthorized();
  }

  return {
    userId: String(userId),
    email: String(email),
    role: String(role),
  };
};

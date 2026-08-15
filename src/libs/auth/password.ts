import bcrypt from 'bcryptjs';

import { ENV } from '@/libs/env';

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);
};

export const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

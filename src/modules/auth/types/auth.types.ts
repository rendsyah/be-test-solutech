import type { UserRole } from '@/generated/prisma/enums';

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
  expires_in: string;
};

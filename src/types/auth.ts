import type { UserRole, UserStatus } from '@/generated/prisma/enums';

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  last_login_at: string | null;
};

export type LoginResponse = {
  access_token: string;
  user: UserResponse;
  expires_in: string;
};

export type RegisterResponse = UserResponse;

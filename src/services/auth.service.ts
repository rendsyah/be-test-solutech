import 'server-only';

import { UserRole, UserStatus } from '@/generated/prisma/enums';
import { hashPassword, signJwt, verifyPassword } from '@/libs/auth';
import { ENV } from '@/libs/env';
import { AppError } from '@/libs/utils';
import { userRepository } from '@/repositories';
import type { LoginResponse, RegisterResponse } from '@/types';
import type { LoginDto, RegisterDto } from '@/validations';

const toUserResponse = (user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date | null;
}): RegisterResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  status: user.status,
  last_login_at: user.lastLoginAt?.toISOString() ?? null,
});

export const authService = {
  register: async (dto: RegisterDto): Promise<RegisterResponse> => {
    const existingUser = await userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw AppError.conflict('Email is already registered');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await userRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    return toUserResponse(user);
  },

  login: async (dto: LoginDto): Promise<LoginResponse> => {
    const user = await userRepository.findByEmail(dto.email);

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw AppError.forbidden('Account is inactive');
    }

    const isValid = await verifyPassword(dto.password, user.passwordHash);

    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const updatedUser = await userRepository.updateLastLogin(user.id);

    const accessToken = await signJwt({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return {
      access_token: accessToken,
      expires_in: ENV.JWT_EXPIRES_IN,
      user: toUserResponse(updatedUser),
    };
  },
};

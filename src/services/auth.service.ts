import 'server-only';

import { signJwt, verifyPassword } from '@/libs/auth';
import { ENV } from '@/libs/env';
import { AppError } from '@/libs/utils';

import { userRepository } from '../../repositories';
import type { LoginResponse } from '../../types';
import type { LoginDto } from '../../validations';

export const authServerService = {
  login: async (dto: LoginDto): Promise<LoginResponse> => {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isValid = await verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const accessToken = await signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expires_in: ENV.JWT_EXPIRES_IN,
    };
  },
};

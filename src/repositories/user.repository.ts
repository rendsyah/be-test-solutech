import type { UserRole, UserStatus } from '@/generated/prisma/enums';
import { prisma } from '@/libs/db';

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
  findById: (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },
  create: (data: {
    email: string;
    passwordHash: string;
    name: string;
    role: UserRole;
    status?: UserStatus;
  }) => {
    return prisma.user.create({ data });
  },
  updateLastLogin: (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
};

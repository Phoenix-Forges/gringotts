import type { Prisma, Session, User } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class AuthRepository {
  findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  createSession(data: Prisma.SessionUncheckedCreateInput): Promise<Session> {
    return prisma.session.create({ data });
  }

  findSession(id: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { id } });
  }

  revokeSession(id: string): Promise<Session> {
    return prisma.session.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  updateSessionRefreshHash(id: string, refreshHash: string): Promise<Session> {
    return prisma.session.update({ where: { id }, data: { refreshHash } });
  }
}

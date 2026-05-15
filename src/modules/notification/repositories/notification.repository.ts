import type { NotificationStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class NotificationRepository {
  list(userId: string) {
    return prisma.notification.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  create(userId: string, data: { title: string; body: string; metadata?: Prisma.InputJsonValue }) {
    return prisma.notification.create({
      data: {
        userId,
        title: data.title,
        body: data.body,
        ...(data.metadata ? { metadata: data.metadata } : {})
      }
    });
  }

  find(id: string) {
    return prisma.notification.findFirst({ where: { id, deletedAt: null } });
  }

  mark(id: string, status: NotificationStatus) {
    return prisma.notification.update({ where: { id }, data: { status } });
  }
}

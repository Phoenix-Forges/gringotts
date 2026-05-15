import { NotificationStatus } from '@prisma/client';
import { AppError } from '../../../shared/errors/app-error.js';
import { queues } from '../../../jobs/queues.js';
import { NotificationRepository } from '../repositories/notification.repository.js';
import type { CreateNotificationDto } from '../schemas/notification.schema.js';

export class NotificationService {
  constructor(private readonly repository = new NotificationRepository()) {}

  list(userId: string) {
    return this.repository.list(userId);
  }

  async create(userId: string, dto: CreateNotificationDto) {
    const notification = await this.repository.create(userId, {
      title: dto.title,
      body: dto.body,
      ...(dto.metadata ? { metadata: dto.metadata } : {})
    });
    await queues.notificationDispatch.add('dispatch-notification', { notificationId: notification.id });
    return notification;
  }

  async dispatch(notificationId: string) {
    const notification = await this.repository.find(notificationId);
    if (!notification) throw new AppError('NOT_FOUND', 'Notification not found', 404);
    return this.repository.mark(notificationId, NotificationStatus.SENT);
  }

  read(notificationId: string) {
    return this.repository.mark(notificationId, NotificationStatus.READ);
  }
}

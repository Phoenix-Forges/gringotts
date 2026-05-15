import type { Notification } from '@prisma/client';

export const toNotificationDto = (notification: Notification) => ({
  id: notification.id,
  title: notification.title,
  body: notification.body,
  status: notification.status,
  createdAt: notification.createdAt
});


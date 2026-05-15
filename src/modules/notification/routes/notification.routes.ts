import type { ServerRoute } from '@hapi/hapi';
import { zodPayload } from '../../../shared/http/zod-validate.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { createNotificationSchema } from '../schemas/notification.schema.js';

const controller = new NotificationController();

export const notificationRoutes: ServerRoute[] = [
  { method: 'GET', path: '/api/v1/notifications', options: { auth: 'jwt', tags: ['api', 'notifications'] }, handler: controller.list },
  {
    method: 'POST',
    path: '/api/v1/notifications',
    options: { auth: 'jwt', tags: ['api', 'notifications'], pre: [{ method: zodPayload(createNotificationSchema) }] },
    handler: controller.create
  },
  { method: 'POST', path: '/api/v1/notifications/{id}/read', options: { auth: 'jwt', tags: ['api', 'notifications'] }, handler: controller.read }
];


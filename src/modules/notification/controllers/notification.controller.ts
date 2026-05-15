import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { NotificationService } from '../services/notification.service.js';
import type { CreateNotificationDto } from '../schemas/notification.schema.js';

export class NotificationController {
  constructor(private readonly service = new NotificationService()) {}
  list = (request: Request) => this.service.list(getAuth(request).userId);
  create = (request: Request) => this.service.create(getAuth(request).userId, request.payload as CreateNotificationDto);
  read = (request: Request) => this.service.read(String(request.params['id']));
}


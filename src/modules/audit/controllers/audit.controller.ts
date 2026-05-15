import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { AuditService } from '../services/audit.service.js';
import type { AuditQueryDto } from '../schemas/audit.schema.js';

export class AuditController {
  constructor(private readonly service = new AuditService()) {}
  list = (request: Request) => this.service.list(getAuth(request).userId, request.query as AuditQueryDto);
}


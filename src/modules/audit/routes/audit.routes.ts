import type { ServerRoute } from '@hapi/hapi';
import { zodQuery } from '../../../shared/http/zod-validate.js';
import { AuditController } from '../controllers/audit.controller.js';
import { auditQuerySchema } from '../schemas/audit.schema.js';

const controller = new AuditController();

export const auditRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/audit/logs',
    options: { auth: 'jwt', tags: ['api', 'audit'], pre: [{ method: zodQuery(auditQuerySchema) }] },
    handler: controller.list
  }
];


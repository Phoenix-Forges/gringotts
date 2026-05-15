import type { ServerRoute } from '@hapi/hapi';
import { zodPayload } from '../../../shared/http/zod-validate.js';
import { SyncController } from '../controllers/sync.controller.js';
import { createConsentSchema, triggerSyncSchema } from '../schemas/sync.schema.js';

const controller = new SyncController();
export const syncRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/sync/aa/consents',
    options: { auth: 'jwt', tags: ['api', 'sync'], pre: [{ method: zodPayload(createConsentSchema) }] },
    handler: controller.consent
  },
  {
    method: 'POST',
    path: '/api/v1/sync/jobs',
    options: { auth: 'jwt', tags: ['api', 'sync'], pre: [{ method: zodPayload(triggerSyncSchema) }] },
    handler: controller.trigger
  },
  { method: 'GET', path: '/api/v1/sync/jobs', options: { auth: 'jwt', tags: ['api', 'sync'] }, handler: controller.jobs }
];


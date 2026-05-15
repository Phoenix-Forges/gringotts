import type { ServerRoute } from '@hapi/hapi';
import { AuthController } from '../controllers/auth.controller.js';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schema.js';
import { zodPayload } from '../../../shared/http/zod-validate.js';

const controller = new AuthController();

export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    options: { auth: false, tags: ['api', 'auth'], pre: [{ method: zodPayload(registerSchema) }] },
    handler: controller.register
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    options: { auth: false, tags: ['api', 'auth'], pre: [{ method: zodPayload(loginSchema) }] },
    handler: controller.login
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    options: { auth: false, tags: ['api', 'auth'], pre: [{ method: zodPayload(refreshSchema) }] },
    handler: controller.refresh
  }
];


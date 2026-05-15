import type { ServerRoute } from '@hapi/hapi';
import { BankController } from '../controllers/bank.controller.js';
import { createBankAccountSchema } from '../schemas/bank.schema.js';
import { zodPayload } from '../../../shared/http/zod-validate.js';

const controller = new BankController();
export const bankRoutes: ServerRoute[] = [
  { method: 'GET', path: '/api/v1/bank/accounts', options: { auth: 'jwt', tags: ['api', 'bank'] }, handler: controller.list },
  {
    method: 'POST',
    path: '/api/v1/bank/accounts',
    options: { auth: 'jwt', tags: ['api', 'bank'], pre: [{ method: zodPayload(createBankAccountSchema) }] },
    handler: controller.create
  }
];


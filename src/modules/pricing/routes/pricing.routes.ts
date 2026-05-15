import type { ServerRoute } from '@hapi/hapi';
import { zodPayload } from '../../../shared/http/zod-validate.js';
import { PricingController } from '../controllers/pricing.controller.js';
import { refreshPricesSchema } from '../schemas/pricing.schema.js';

const controller = new PricingController();
export const pricingRoutes: ServerRoute[] = [
  { method: 'GET', path: '/api/v1/pricing/latest', options: { auth: 'jwt', tags: ['api', 'pricing'] }, handler: controller.latest },
  {
    method: 'POST',
    path: '/api/v1/pricing/refresh',
    options: { auth: 'jwt', tags: ['api', 'pricing'], pre: [{ method: zodPayload(refreshPricesSchema) }] },
    handler: controller.refresh
  }
];


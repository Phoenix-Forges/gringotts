import type { ServerRoute } from '@hapi/hapi';
import { AssetController } from '../controllers/asset.controller.js';
import { createAssetSchema } from '../schemas/asset.schema.js';
import { zodPayload } from '../../../shared/http/zod-validate.js';

const controller = new AssetController();

export const assetRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/v1/assets',
    options: { auth: 'jwt', tags: ['api', 'assets'] },
    handler: controller.list
  },
  {
    method: 'POST',
    path: '/api/v1/assets',
    options: { auth: 'jwt', tags: ['api', 'assets'], pre: [{ method: zodPayload(createAssetSchema) }] },
    handler: controller.create
  }
];


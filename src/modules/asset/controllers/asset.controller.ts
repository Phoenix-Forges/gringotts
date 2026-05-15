import type { Request } from '@hapi/hapi';
import { AssetService } from '../services/asset.service.js';
import type { CreateAssetDto } from '../schemas/asset.schema.js';

export class AssetController {
  constructor(private readonly service = new AssetService()) {}
  list = () => this.service.listAssets();
  create = (request: Request) => this.service.createAsset(request.payload as CreateAssetDto);
}


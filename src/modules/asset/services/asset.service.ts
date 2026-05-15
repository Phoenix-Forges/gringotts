import { AssetRepository } from '../repositories/asset.repository.js';
import type { CreateAssetDto } from '../schemas/asset.schema.js';

export class AssetService {
  constructor(private readonly repository = new AssetRepository()) {}

  listAssets() {
    return this.repository.list();
  }

  createAsset(dto: CreateAssetDto) {
    return this.repository.create({
      symbol: dto.symbol,
      name: dto.name,
      type: dto.type,
      currency: dto.currency,
      ...(dto.isin ? { isin: dto.isin } : {}),
      ...(dto.exchange ? { exchange: dto.exchange } : {})
    });
  }
}

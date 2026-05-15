import type { Asset } from '@prisma/client';

export const toAssetDto = (asset: Asset) => ({
  id: asset.id,
  symbol: asset.symbol,
  name: asset.name,
  type: asset.type,
  currency: asset.currency
});


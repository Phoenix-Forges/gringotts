import type { Currency, SyncProvider } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class PricingRepository {
  listPricedAssets() {
    return prisma.asset.findMany({ where: { deletedAt: null } });
  }

  upsertAssetPrice(assetId: string, price: number, currency: Currency, source: SyncProvider, pricedAt: Date) {
    return prisma.assetPrice.upsert({
      where: { assetId_pricedAt_source: { assetId, pricedAt, source } },
      update: { price, currency },
      create: { assetId, price, currency, source, pricedAt }
    });
  }

  latestPrices(assetIds: string[]) {
    return prisma.assetPrice.findMany({
      where: { assetId: { in: assetIds } },
      include: { asset: true },
      orderBy: { pricedAt: 'desc' },
      distinct: ['assetId']
    });
  }

  upsertExchangeRate(baseCurrency: Currency, quoteCurrency: Currency, rate: number, source: SyncProvider, ratedAt: Date) {
    return prisma.exchangeRate.upsert({
      where: { baseCurrency_quoteCurrency_ratedAt_source: { baseCurrency, quoteCurrency, ratedAt, source } },
      update: { rate },
      create: { baseCurrency, quoteCurrency, rate, source, ratedAt }
    });
  }
}

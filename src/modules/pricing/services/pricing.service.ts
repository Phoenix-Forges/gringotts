import { AssetType, Currency, SyncProvider } from '@prisma/client';
import { cache } from '../../../infrastructure/cache/cache.js';
import { providers } from '../../../infrastructure/providers/mock-providers.js';
import { PricingRepository } from '../repositories/pricing.repository.js';

export class PricingService {
  constructor(private readonly repository = new PricingRepository()) {}

  async refreshMarketPrices(symbols: string[]): Promise<{ refreshed: number }> {
    const quotes = await providers.yahoo.getQuotes(symbols);
    for (const quote of quotes) {
      const asset = await this.findAssetBySymbol(quote.symbol);
      if (asset) {
        await this.repository.upsertAssetPrice(asset.id, quote.price, quote.currency, SyncProvider.YAHOO_FINANCE, quote.pricedAt);
        await cache.setJson(`price:${quote.symbol}`, quote, 900);
      }
    }
    return { refreshed: quotes.length };
  }

  async refreshAllPrices(): Promise<{ refreshed: number }> {
    const assets = await this.repository.listPricedAssets();
    const marketSymbols = assets
      .filter((asset) => asset.type === AssetType.INDIAN_STOCK || asset.type === AssetType.US_STOCK)
      .map((asset) => asset.symbol);
    await this.refreshMarketPrices(marketSymbols);

    const mfAssets = assets.filter((asset) => asset.type === AssetType.MUTUAL_FUND && asset.isin);
    const navs = await providers.amfi.getNavs(mfAssets.map((asset) => asset.isin).filter((isin): isin is string => Boolean(isin)));
    for (const nav of navs) {
      const asset = mfAssets.find((candidate) => candidate.isin === nav.isin);
      if (asset) await this.repository.upsertAssetPrice(asset.id, nav.nav, Currency.INR, SyncProvider.AMFI, nav.pricedAt);
    }

    const metals = await providers.gold.getMetalPrices();
    for (const metal of metals) {
      const asset = assets.find((candidate) => candidate.type === (metal.metal === 'gold' ? AssetType.GOLD : AssetType.SILVER));
      if (asset) await this.repository.upsertAssetPrice(asset.id, metal.pricePerGram, metal.currency, SyncProvider.GOLD_PRICE, metal.pricedAt);
    }

    const fx = await providers.fx.getRate(Currency.USD, Currency.INR);
    await this.repository.upsertExchangeRate(fx.baseCurrency, fx.quoteCurrency, fx.rate, SyncProvider.EXCHANGE_RATE, fx.ratedAt);
    await cache.setJson('fx:USD:INR', fx, 3600);
    return { refreshed: marketSymbols.length + navs.length + metals.length + 1 };
  }

  async getLatestPrices(): Promise<unknown[]> {
    const assets = await this.repository.listPricedAssets();
    return this.repository.latestPrices(assets.map((asset) => asset.id));
  }

  private async findAssetBySymbol(symbol: string) {
    const assets = await this.repository.listPricedAssets();
    return assets.find((asset) => asset.symbol === symbol) ?? null;
  }
}


import { AssetType, Currency } from '@prisma/client';
import type {
  AAProvider,
  AMFIProvider,
  ConsentHandle,
  ConsentRequest,
  ExchangeQuote,
  ExchangeRateProvider,
  GoldPriceProvider,
  INDMoneyProvider,
  MarketPrice,
  MetalPrice,
  NavPrice,
  NormalizedFinancialItem,
  YahooFinanceProvider
} from './types.js';

export class MockYahooFinanceProvider implements YahooFinanceProvider {
  async getQuotes(symbols: string[]): Promise<MarketPrice[]> {
    return symbols.map((symbol, index) => ({
      symbol,
      price: 1000 + index * 137.25,
      currency: symbol.endsWith('.NS') ? Currency.INR : Currency.USD,
      pricedAt: new Date()
    }));
  }
}

export class MockAMFIProvider implements AMFIProvider {
  async getNavs(isins: string[]): Promise<NavPrice[]> {
    return isins.map((isin, index) => ({ isin, nav: 25 + index * 3.2, pricedAt: new Date() }));
  }
}

export class MockGoldPriceProvider implements GoldPriceProvider {
  async getMetalPrices(): Promise<MetalPrice[]> {
    return [
      { metal: 'gold', pricePerGram: 7200, currency: Currency.INR, pricedAt: new Date() },
      { metal: 'silver', pricePerGram: 92, currency: Currency.INR, pricedAt: new Date() }
    ];
  }
}

export class MockExchangeRateProvider implements ExchangeRateProvider {
  async getRate(baseCurrency: Currency, quoteCurrency: Currency): Promise<ExchangeQuote> {
    const rate = baseCurrency === quoteCurrency ? 1 : baseCurrency === Currency.USD ? 83 : 0.012;
    return { baseCurrency, quoteCurrency, rate, ratedAt: new Date() };
  }
}

export class MockINDMoneyProvider implements INDMoneyProvider {
  async fetchPortfolio(userId: string): Promise<NormalizedFinancialItem[]> {
    return [
      {
        providerRef: `indmoney:${userId}:aapl`,
        assetType: AssetType.US_STOCK,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 3,
        currentValue: 570,
        currency: Currency.USD
      }
    ];
  }
}

export class MockAAProvider implements AAProvider {
  async requestConsent(request: ConsentRequest): Promise<ConsentHandle> {
    return { consentId: `consent_${request.userId}_${Date.now()}`, status: 'ACTIVE' };
  }

  async fetchFinancialInformation(consentId: string): Promise<NormalizedFinancialItem[]> {
    return [
      {
        providerRef: `${consentId}:savings`,
        assetType: AssetType.BANK,
        symbol: 'SAVINGS',
        name: 'Savings Balance',
        quantity: 1,
        currentValue: 250000,
        currency: Currency.INR
      }
    ];
  }
}

export const providers = {
  yahoo: new MockYahooFinanceProvider(),
  amfi: new MockAMFIProvider(),
  gold: new MockGoldPriceProvider(),
  fx: new MockExchangeRateProvider(),
  indmoney: new MockINDMoneyProvider(),
  aa: new MockAAProvider()
};


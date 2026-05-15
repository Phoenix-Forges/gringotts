import type { AssetType, Currency } from '@prisma/client';

export interface MarketPrice {
  symbol: string;
  price: number;
  currency: Currency;
  pricedAt: Date;
}

export interface NavPrice {
  isin: string;
  nav: number;
  pricedAt: Date;
}

export interface MetalPrice {
  metal: 'gold' | 'silver';
  pricePerGram: number;
  currency: Currency;
  pricedAt: Date;
}

export interface ExchangeQuote {
  baseCurrency: Currency;
  quoteCurrency: Currency;
  rate: number;
  ratedAt: Date;
}

export interface NormalizedFinancialItem {
  providerRef: string;
  assetType: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  currentValue: number;
  currency: Currency;
}

export interface ConsentRequest {
  userId: string;
  institutionId: string;
  scopes: string[];
  expiresAt: Date;
}

export interface ConsentHandle {
  consentId: string;
  status: 'PENDING' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export interface YahooFinanceProvider {
  getQuotes(symbols: string[]): Promise<MarketPrice[]>;
}

export interface AMFIProvider {
  getNavs(isins: string[]): Promise<NavPrice[]>;
}

export interface GoldPriceProvider {
  getMetalPrices(): Promise<MetalPrice[]>;
}

export interface ExchangeRateProvider {
  getRate(baseCurrency: Currency, quoteCurrency: Currency): Promise<ExchangeQuote>;
}

export interface INDMoneyProvider {
  fetchPortfolio(userId: string): Promise<NormalizedFinancialItem[]>;
}

export interface AAProvider {
  requestConsent(request: ConsentRequest): Promise<ConsentHandle>;
  fetchFinancialInformation(consentId: string): Promise<NormalizedFinancialItem[]>;
}


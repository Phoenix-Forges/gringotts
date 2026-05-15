import { Currency } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { MockExchangeRateProvider, MockYahooFinanceProvider } from '../src/infrastructure/providers/mock-providers.js';

describe('mock providers', () => {
  it('returns deterministic market quotes', async () => {
    const provider = new MockYahooFinanceProvider();
    const quotes = await provider.getQuotes(['INFY.NS', 'AAPL']);
    expect(quotes).toHaveLength(2);
    expect(quotes[0]?.currency).toBe(Currency.INR);
    expect(quotes[1]?.currency).toBe(Currency.USD);
  });

  it('returns USD INR exchange rate', async () => {
    const provider = new MockExchangeRateProvider();
    const quote = await provider.getRate(Currency.USD, Currency.INR);
    expect(quote.rate).toBeGreaterThan(80);
  });
});


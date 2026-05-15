import { cache } from '../../../infrastructure/cache/cache.js';
import { PortfolioRepository } from '../repositories/portfolio.repository.js';

interface HoldingValue {
  holdingId: string;
  symbol: string;
  assetType: string;
  quantity: number;
  investedValue: number;
  currentValue: number;
  realizedGain: number;
  unrealizedGain: number;
}

export class PortfolioService {
  constructor(private readonly repository = new PortfolioRepository()) {}

  async summary(userId: string) {
    const cached = await cache.getJson<{ holdings: HoldingValue[]; totals: Record<string, number> }>(`portfolio:${userId}`);
    if (cached) return cached;
    const holdings = await this.valuedHoldings(userId);
    const totalInvested = holdings.reduce((sum, holding) => sum + holding.investedValue, 0);
    const currentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const realizedGain = holdings.reduce((sum, holding) => sum + holding.realizedGain, 0);
    const unrealizedGain = currentValue - totalInvested;
    const response = { holdings, totals: { totalInvested, currentValue, realizedGain, unrealizedGain } };
    await cache.setJson(`portfolio:${userId}`, response, 300);
    return response;
  }

  async allocation(userId: string) {
    const holdings = await this.valuedHoldings(userId);
    const total = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const grouped = new Map<string, number>();
    for (const holding of holdings) grouped.set(holding.assetType, (grouped.get(holding.assetType) ?? 0) + holding.currentValue);
    return Array.from(grouped.entries()).map(([assetType, value]) => ({ assetType, value, percentage: total > 0 ? value / total : 0 }));
  }

  async generateSnapshot(userId: string) {
    const summary = await this.summary(userId);
    const allocation = await this.allocation(userId);
    return this.repository.createSnapshot(userId, {
      totalInvested: summary.totals.totalInvested ?? 0,
      currentValue: summary.totals.currentValue ?? 0,
      realizedGain: summary.totals.realizedGain ?? 0,
      unrealizedGain: summary.totals.unrealizedGain ?? 0,
      netWorth: summary.totals.currentValue ?? 0,
      allocationJson: { allocation }
    });
  }

  history(userId: string) {
    return this.repository.snapshots(userId);
  }

  private async valuedHoldings(userId: string): Promise<HoldingValue[]> {
    const holdings = await this.repository.holdings(userId);
    return holdings.map((holding) => {
      const price = holding.asset.prices[0]?.price ?? holding.averageCost;
      const quantity = Number(holding.quantity);
      const investedValue = Number(holding.investedValue);
      const currentValue = quantity * Number(price);
      return {
        holdingId: holding.id,
        symbol: holding.asset.symbol,
        assetType: holding.asset.type,
        quantity,
        investedValue,
        currentValue,
        realizedGain: Number(holding.realizedGain),
        unrealizedGain: currentValue - investedValue
      };
    });
  }
}


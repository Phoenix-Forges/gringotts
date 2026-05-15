import { AccountType, TransactionType } from '@prisma/client';
import { cache } from '../../../infrastructure/cache/cache.js';
import { cagr, xirr, type CashFlow } from '../../../shared/finance/calculations.js';
import { AnalyticsRepository } from '../repositories/analytics.repository.js';

export class AnalyticsService {
  constructor(private readonly repository = new AnalyticsRepository()) {}

  async netWorth(userId: string) {
    const cached = await cache.getJson<{ netWorth: number }>(`analytics:net-worth:${userId}`);
    if (cached) return cached;
    const holdings = await this.repository.holdings(userId);
    const accounts = await this.repository.bankAccounts(userId);
    const portfolioValue = holdings.reduce((sum, holding) => {
      const price = Number(holding.asset.prices[0]?.price ?? holding.averageCost);
      return sum + Number(holding.quantity) * price;
    }, 0);
    const bankAssets = accounts.reduce((sum, account) => {
      if (account.bankAccount) return sum + Number(account.bankAccount.balance);
      if (account.fixedDeposit) return sum + Number(account.fixedDeposit.currentValue);
      if (account.recurringDeposit) return sum + Number(account.recurringDeposit.currentValue);
      return sum;
    }, 0);
    const liabilities = accounts.reduce((sum, account) => {
      if (account.type === AccountType.LOAN && account.loan) return sum + Number(account.loan.outstanding);
      if (account.type === AccountType.CREDIT_CARD && account.creditCard) return sum + Number(account.creditCard.outstanding);
      return sum;
    }, 0);
    const result = { netWorth: portfolioValue + bankAssets - liabilities, portfolioValue, bankAssets, liabilities };
    await cache.setJson(`analytics:net-worth:${userId}`, result, 300);
    return result;
  }

  async performance(userId: string) {
    const transactions = await this.repository.transactions(userId);
    const flows: CashFlow[] = transactions.map((transaction) => ({
      amount:
        transaction.type === TransactionType.BUY || transaction.type === TransactionType.DEPOSIT
          ? -Number(transaction.amount)
          : Number(transaction.amount),
      date: transaction.occurredAt
    }));
    const netWorth = await this.netWorth(userId);
    flows.push({ amount: netWorth.netWorth, date: new Date() });
    const first = flows[0];
    const years = first ? (Date.now() - first.date.getTime()) / (365 * 24 * 60 * 60 * 1000) : 0;
    const invested = Math.abs(flows.filter((flow) => flow.amount < 0).reduce((sum, flow) => sum + flow.amount, 0));
    return {
      xirr: xirr(flows),
      cagr: cagr(invested, netWorth.netWorth, years),
      invested,
      currentValue: netWorth.netWorth
    };
  }

  async trends(userId: string) {
    return this.repository.snapshots(userId);
  }
}


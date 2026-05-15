import { prisma } from '../../../infrastructure/database/prisma.js';

export class AnalyticsRepository {
  holdings(userId: string) {
    return prisma.holding.findMany({
      where: { userId, deletedAt: null },
      include: { asset: { include: { prices: { orderBy: { pricedAt: 'desc' }, take: 1 } } } }
    });
  }

  transactions(userId: string) {
    return prisma.transaction.findMany({ where: { userId, deletedAt: null }, orderBy: { occurredAt: 'asc' } });
  }

  snapshots(userId: string) {
    return prisma.portfolioSnapshot.findMany({ where: { userId }, orderBy: { snapshotDate: 'asc' } });
  }

  bankAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId, deletedAt: null },
      include: { bankAccount: true, fixedDeposit: true, recurringDeposit: true, loan: true, creditCard: true }
    });
  }
}


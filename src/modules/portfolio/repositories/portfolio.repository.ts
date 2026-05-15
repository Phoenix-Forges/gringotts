import { prisma } from '../../../infrastructure/database/prisma.js';

export class PortfolioRepository {
  holdings(userId: string) {
    return prisma.holding.findMany({
      where: { userId, deletedAt: null },
      include: { asset: { include: { prices: { orderBy: { pricedAt: 'desc' }, take: 1 } } }, account: true }
    });
  }

  transactions(userId: string) {
    return prisma.transaction.findMany({ where: { userId, deletedAt: null }, orderBy: { occurredAt: 'asc' } });
  }

  createSnapshot(userId: string, data: { totalInvested: number; currentValue: number; realizedGain: number; unrealizedGain: number; netWorth: number; allocationJson: object }) {
    const snapshotDate = new Date(new Date().toISOString().slice(0, 10));
    return prisma.portfolioSnapshot.upsert({
      where: { userId_snapshotDate: { userId, snapshotDate } },
      update: data,
      create: { userId, snapshotDate, ...data }
    });
  }

  snapshots(userId: string) {
    return prisma.portfolioSnapshot.findMany({ where: { userId }, orderBy: { snapshotDate: 'asc' } });
  }
}


import { AccountType, AssetType, Currency, SyncProvider, SyncStatus } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';
import { providers } from '../../../infrastructure/providers/mock-providers.js';
import type { ConsentRequest, NormalizedFinancialItem } from '../../../infrastructure/providers/types.js';
import { queues } from '../../../jobs/queues.js';
import { SyncRepository } from '../repositories/sync.repository.js';
import type { CreateConsentDto, TriggerSyncDto } from '../schemas/sync.schema.js';

export class SyncService {
  constructor(private readonly repository = new SyncRepository()) {}

  async requestAaConsent(userId: string, dto: CreateConsentDto) {
    const request: ConsentRequest = { userId, institutionId: dto.institutionId, scopes: dto.scopes, expiresAt: new Date(dto.expiresAt) };
    const consent = await providers.aa.requestConsent(request);
    await this.repository.createJob(userId, SyncProvider.AA, 'AA_CONSENT_REQUEST', {
      request: { ...request, expiresAt: request.expiresAt.toISOString() },
      consent: { consentId: consent.consentId, status: consent.status }
    });
    return consent;
  }

  async trigger(userId: string, dto: TriggerSyncDto) {
    const job = await this.repository.createJob(userId, dto.provider, 'MANUAL_SYNC', { provider: dto.provider });
    if (dto.provider === SyncProvider.AA) await queues.bankSync.add('manual-aa-sync', { userId, syncJobId: job.id });
    if (dto.provider === SyncProvider.INDMONEY) await queues.bankSync.add('manual-indmoney-sync', { userId, syncJobId: job.id });
    if (dto.provider === SyncProvider.YAHOO_FINANCE) await queues.marketSync.add('manual-market-sync', { userId, syncJobId: job.id });
    return job;
  }

  jobs(userId: string) {
    return this.repository.listJobs(userId);
  }

  async runAaSync(userId: string) {
    const job = await this.repository.createJob(userId, SyncProvider.AA, 'AA_FI_FETCH', {});
    await this.repository.updateJob(job.id, { status: SyncStatus.RUNNING, startedAt: new Date() });
    try {
      const items = await providers.aa.fetchFinancialInformation(`latest:${userId}`);
      await this.ingestNormalizedItems(userId, items, SyncProvider.AA);
      await this.repository.addLog(job.id, 'info', 'AA sync completed', { count: items.length });
      await this.repository.updateJob(job.id, { status: SyncStatus.SUCCESS, finishedAt: new Date() });
      return { synced: items.length };
    } catch (error) {
      await this.repository.updateJob(job.id, { status: SyncStatus.FAILED, finishedAt: new Date(), errorMessage: String(error) });
      throw error;
    }
  }

  async runIndMoneySync(userId: string) {
    const items = await providers.indmoney.fetchPortfolio(userId);
    await this.ingestNormalizedItems(userId, items, SyncProvider.INDMONEY);
    return { synced: items.length };
  }

  private async ingestNormalizedItems(userId: string, items: NormalizedFinancialItem[], provider: SyncProvider) {
    for (const item of items) {
      const asset = await prisma.asset.upsert({
        where: { symbol_type: { symbol: item.symbol, type: item.assetType } },
        update: { name: item.name, currency: item.currency },
        create: { symbol: item.symbol, name: item.name, type: item.assetType, currency: item.currency }
      });
      const account = await prisma.account.upsert({
        where: { userId_externalRef: { userId, externalRef: item.providerRef } },
        update: { name: provider === SyncProvider.AA ? 'Account Aggregator Import' : 'INDmoney Import' },
        create: {
          userId,
          name: provider === SyncProvider.AA ? 'Account Aggregator Import' : 'INDmoney Import',
          type: item.assetType === AssetType.BANK ? AccountType.SAVINGS : AccountType.BROKERAGE,
          currency: item.currency === Currency.USD ? Currency.USD : Currency.INR,
          externalRef: item.providerRef
        }
      });
      await prisma.holding.upsert({
        where: { userId_assetId_accountId: { userId, assetId: asset.id, accountId: account.id } },
        update: {
          quantity: item.quantity,
          investedValue: item.currentValue,
          averageCost: item.quantity > 0 ? item.currentValue / item.quantity : item.currentValue
        },
        create: {
          userId,
          accountId: account.id,
          assetId: asset.id,
          quantity: item.quantity,
          investedValue: item.currentValue,
          averageCost: item.quantity > 0 ? item.currentValue / item.quantity : item.currentValue
        }
      });
    }
  }
}

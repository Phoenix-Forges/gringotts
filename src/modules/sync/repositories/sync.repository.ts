import { SyncStatus } from '@prisma/client';
import type { Prisma, SyncProvider } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class SyncRepository {
  createJob(userId: string | null, provider: SyncProvider, jobType: string, payload: Prisma.InputJsonValue) {
    return prisma.syncJob.create({
      data: {
        provider,
        jobType,
        payload,
        status: SyncStatus.QUEUED,
        ...(userId ? { user: { connect: { id: userId } } } : {})
      }
    });
  }

  updateJob(id: string, data: { status: SyncStatus; errorMessage?: string; startedAt?: Date; finishedAt?: Date }) {
    return prisma.syncJob.update({ where: { id }, data });
  }

  addLog(syncJobId: string, level: string, message: string, metadata?: Prisma.InputJsonValue) {
    return prisma.syncLog.create({
      data: { syncJobId, level, message, ...(metadata ? { metadata } : {}) }
    });
  }

  listJobs(userId: string) {
    return prisma.syncJob.findMany({ where: { userId }, include: { logs: true }, orderBy: { createdAt: 'desc' }, take: 50 });
  }
}

import { Queue, Worker, type JobsOptions } from 'bullmq';
import { redis } from '../infrastructure/cache/cache.js';
import { logger } from '../infrastructure/logging/logger.js';

export const queueNames = {
  priceRefresh: 'price-refresh',
  portfolioRecalculation: 'portfolio-recalculation',
  bankSync: 'bank-sync',
  marketSync: 'market-sync',
  notificationDispatch: 'notification-dispatch'
} as const;

const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: 100,
  removeOnFail: false
};

export const queues = {
  priceRefresh: new Queue(queueNames.priceRefresh, { connection: redis, defaultJobOptions }),
  portfolioRecalculation: new Queue(queueNames.portfolioRecalculation, { connection: redis, defaultJobOptions }),
  bankSync: new Queue(queueNames.bankSync, { connection: redis, defaultJobOptions }),
  marketSync: new Queue(queueNames.marketSync, { connection: redis, defaultJobOptions }),
  notificationDispatch: new Queue(queueNames.notificationDispatch, { connection: redis, defaultJobOptions })
};

export function createWorker<T>(
  queueName: string,
  handler: (data: T) => Promise<void>,
  concurrency: number,
): Worker<T> {
  const worker = new Worker<T>(
    queueName,
    async (job) => {
      logger.info({ queueName, jobId: job.id }, 'Processing job');
      await handler(job.data);
    },
    { connection: redis, concurrency },
  );
  worker.on('failed', (job, error) => {
    logger.error({ queueName, jobId: job?.id, error }, 'Job failed and retained for dead-letter review');
  });
  return worker;
}


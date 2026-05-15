import cron from 'node-cron';
import { queues } from './queues.js';
import { logger } from '../infrastructure/logging/logger.js';
import { prisma } from '../infrastructure/database/prisma.js';

async function enqueueForEveryUser(name: string, enqueue: (userId: string) => Promise<unknown>): Promise<void> {
  const users = await prisma.user.findMany({ where: { deletedAt: null }, select: { id: true } });
  await Promise.all(users.map((user) => enqueue(user.id)));
  logger.info({ name, users: users.length }, 'Scheduled jobs enqueued');
}

cron.schedule('0 18 * * 1-5', () => {
  void queues.marketSync.add('daily-market-sync', {});
});

cron.schedule('30 8 * * *', () => {
  void queues.priceRefresh.add('daily-metal-fx-refresh', { symbols: [] });
});

cron.schedule('0 23 * * *', () => {
  void enqueueForEveryUser('daily-portfolio-snapshot', (userId) =>
    queues.portfolioRecalculation.add('daily-portfolio-snapshot', { userId }),
  );
});

cron.schedule('*/30 * * * *', () => {
  void enqueueForEveryUser('stale-sync-detection', (userId) => queues.bankSync.add('stale-sync-detection', { userId }));
});

logger.info('Schedulers registered');

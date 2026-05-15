import { queueNames, createWorker } from './queues.js';
import { PricingService } from '../modules/pricing/services/pricing.service.js';
import { PortfolioService } from '../modules/portfolio/services/portfolio.service.js';
import { SyncService } from '../modules/sync/services/sync.service.js';
import { NotificationService } from '../modules/notification/services/notification.service.js';
import { logger } from '../infrastructure/logging/logger.js';

const pricing = new PricingService();
const portfolio = new PortfolioService();
const sync = new SyncService();
const notification = new NotificationService();

createWorker<{ symbols?: string[] }>(queueNames.priceRefresh, async (data) => {
  await pricing.refreshMarketPrices(data.symbols ?? []);
}, 5);
createWorker<{ userId: string }>(queueNames.portfolioRecalculation, async (data) => {
  await portfolio.generateSnapshot(data.userId);
}, 3);
createWorker<{ userId: string }>(queueNames.bankSync, async (data) => {
  await sync.runAaSync(data.userId);
}, 2);
createWorker<{ userId?: string }>(queueNames.marketSync, async () => {
  await pricing.refreshAllPrices();
}, 3);
createWorker<{ notificationId: string }>(
  queueNames.notificationDispatch,
  async (data) => {
    await notification.dispatch(data.notificationId);
  },
  5,
);

logger.info('BullMQ workers started');

import type { Server } from '@hapi/hapi';
import { authRoutes } from './modules/auth/routes/auth.routes.js';
import { portfolioRoutes } from './modules/portfolio/routes/portfolio.routes.js';
import { assetRoutes } from './modules/asset/routes/asset.routes.js';
import { bankRoutes } from './modules/bank/routes/bank.routes.js';
import { pricingRoutes } from './modules/pricing/routes/pricing.routes.js';
import { analyticsRoutes } from './modules/analytics/routes/analytics.routes.js';
import { syncRoutes } from './modules/sync/routes/sync.routes.js';
import { notificationRoutes } from './modules/notification/routes/notification.routes.js';
import { auditRoutes } from './modules/audit/routes/audit.routes.js';

export async function registerRoutes(server: Server): Promise<void> {
  server.route([
    ...authRoutes,
    ...portfolioRoutes,
    ...assetRoutes,
    ...bankRoutes,
    ...pricingRoutes,
    ...analyticsRoutes,
    ...syncRoutes,
    ...notificationRoutes,
    ...auditRoutes
  ]);
}

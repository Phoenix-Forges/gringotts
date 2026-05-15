import type { ServerRoute } from '@hapi/hapi';
import { AnalyticsController } from '../controllers/analytics.controller.js';

const controller = new AnalyticsController();

export const analyticsRoutes: ServerRoute[] = [
  { method: 'GET', path: '/api/v1/analytics/net-worth', options: { auth: 'jwt', tags: ['api', 'analytics'] }, handler: controller.netWorth },
  { method: 'GET', path: '/api/v1/analytics/performance', options: { auth: 'jwt', tags: ['api', 'analytics'] }, handler: controller.performance },
  { method: 'GET', path: '/api/v1/analytics/trends', options: { auth: 'jwt', tags: ['api', 'analytics'] }, handler: controller.trends }
];


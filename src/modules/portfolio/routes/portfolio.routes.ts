import type { ServerRoute } from '@hapi/hapi';
import { PortfolioController } from '../controllers/portfolio.controller.js';

const controller = new PortfolioController();
export const portfolioRoutes: ServerRoute[] = [
  { method: 'GET', path: '/api/v1/portfolio/summary', options: { auth: 'jwt', tags: ['api', 'portfolio'] }, handler: controller.summary },
  { method: 'GET', path: '/api/v1/portfolio/allocation', options: { auth: 'jwt', tags: ['api', 'portfolio'] }, handler: controller.allocation },
  { method: 'POST', path: '/api/v1/portfolio/snapshots', options: { auth: 'jwt', tags: ['api', 'portfolio'] }, handler: controller.snapshot },
  { method: 'GET', path: '/api/v1/portfolio/snapshots', options: { auth: 'jwt', tags: ['api', 'portfolio'] }, handler: controller.history }
];


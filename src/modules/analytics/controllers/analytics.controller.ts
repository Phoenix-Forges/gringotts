import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  constructor(private readonly service = new AnalyticsService()) {}
  netWorth = (request: Request) => this.service.netWorth(getAuth(request).userId);
  performance = (request: Request) => this.service.performance(getAuth(request).userId);
  trends = (request: Request) => this.service.trends(getAuth(request).userId);
}


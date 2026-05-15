import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { PortfolioService } from '../services/portfolio.service.js';

export class PortfolioController {
  constructor(private readonly service = new PortfolioService()) {}
  summary = (request: Request) => this.service.summary(getAuth(request).userId);
  allocation = (request: Request) => this.service.allocation(getAuth(request).userId);
  snapshot = (request: Request) => this.service.generateSnapshot(getAuth(request).userId);
  history = (request: Request) => this.service.history(getAuth(request).userId);
}


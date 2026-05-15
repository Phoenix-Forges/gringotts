import type { Request } from '@hapi/hapi';
import { PricingService } from '../services/pricing.service.js';

export class PricingController {
  constructor(private readonly service = new PricingService()) {}
  latest = () => this.service.getLatestPrices();
  refresh = (request: Request) => {
    const payload = request.payload as { symbols?: string[] };
    return payload.symbols?.length ? this.service.refreshMarketPrices(payload.symbols) : this.service.refreshAllPrices();
  };
}


import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { SyncService } from '../services/sync.service.js';
import type { CreateConsentDto, TriggerSyncDto } from '../schemas/sync.schema.js';

export class SyncController {
  constructor(private readonly service = new SyncService()) {}
  consent = (request: Request) => this.service.requestAaConsent(getAuth(request).userId, request.payload as CreateConsentDto);
  trigger = (request: Request) => this.service.trigger(getAuth(request).userId, request.payload as TriggerSyncDto);
  jobs = (request: Request) => this.service.jobs(getAuth(request).userId);
}


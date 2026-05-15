import { AuditRepository } from '../repositories/audit.repository.js';
import type { AuditQueryDto } from '../schemas/audit.schema.js';

export class AuditService {
  constructor(private readonly repository = new AuditRepository()) {}
  list(userId: string, query: AuditQueryDto) {
    return this.repository.list(userId, query);
  }
  record(data: Parameters<AuditRepository['create']>[0]) {
    return this.repository.create(data);
  }
}


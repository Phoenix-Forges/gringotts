import type { AuditLog } from '@prisma/client';

export const toAuditDto = (log: AuditLog) => ({
  id: log.id,
  action: log.action,
  entityType: log.entityType,
  entityId: log.entityId,
  createdAt: log.createdAt
});


import type { Prisma } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';
import type { AuditQueryDto } from '../schemas/audit.schema.js';

export class AuditRepository {
  list(userId: string, query: AuditQueryDto) {
    return prisma.auditLog.findMany({
      where: {
        userId,
        ...(query.entityType ? { entityType: query.entityType } : {}),
        ...(query.action ? { action: query.action } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  create(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  }
}

import { z } from 'zod';

export const auditQuerySchema = z.object({
  entityType: z.string().optional(),
  action: z.string().optional()
});

export type AuditQueryDto = z.infer<typeof auditQuerySchema>;


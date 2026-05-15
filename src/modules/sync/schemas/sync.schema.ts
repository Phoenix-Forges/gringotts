import { SyncProvider } from '@prisma/client';
import { z } from 'zod';

export const createConsentSchema = z.object({
  institutionId: z.string().uuid(),
  scopes: z.array(z.string().min(1)).min(1),
  expiresAt: z.string().datetime()
});

export const triggerSyncSchema = z.object({
  provider: z.nativeEnum(SyncProvider)
});

export type CreateConsentDto = z.infer<typeof createConsentSchema>;
export type TriggerSyncDto = z.infer<typeof triggerSyncSchema>;


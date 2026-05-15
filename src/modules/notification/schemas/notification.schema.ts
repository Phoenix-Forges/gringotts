import { z } from 'zod';

export const createNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;


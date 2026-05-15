import { z } from 'zod';
export const analyticsRangeSchema = z.object({ from: z.string().datetime().optional(), to: z.string().datetime().optional() });


import { z } from 'zod';

export const refreshPricesSchema = z.object({
  symbols: z.array(z.string().min(1)).optional()
});


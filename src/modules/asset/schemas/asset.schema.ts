import { AssetType, Currency } from '@prisma/client';
import { z } from 'zod';

export const createAssetSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(AssetType),
  currency: z.nativeEnum(Currency),
  isin: z.string().optional(),
  exchange: z.string().optional()
});

export type CreateAssetDto = z.infer<typeof createAssetSchema>;


import { AccountType, Currency } from '@prisma/client';
import { z } from 'zod';

export const createBankAccountSchema = z.object({
  name: z.string().min(1),
  institutionId: z.string().uuid().optional(),
  type: z.nativeEnum(AccountType).default(AccountType.SAVINGS),
  currency: z.nativeEnum(Currency).default(Currency.INR),
  balance: z.number().nonnegative()
});

export type CreateBankAccountDto = z.infer<typeof createBankAccountSchema>;


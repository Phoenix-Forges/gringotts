import { AccountType } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class BankRepository {
  listAccounts(userId: string) {
    return prisma.account.findMany({
      where: {
        userId,
        deletedAt: null,
        type: { in: [AccountType.SAVINGS, AccountType.CURRENT, AccountType.CREDIT_CARD, AccountType.LOAN, AccountType.FIXED_DEPOSIT, AccountType.RECURRING_DEPOSIT] }
      },
      include: { bankAccount: true, creditCard: true, loan: true, fixedDeposit: true, recurringDeposit: true }
    });
  }

  createBankAccount(
    userId: string,
    data: { name: string; type: AccountType; currency: 'INR' | 'USD'; institutionId?: string },
    balance: number,
  ) {
    return prisma.account.create({
      data: {
        name: data.name,
        type: data.type,
        currency: data.currency,
        user: { connect: { id: userId } },
        ...(data.institutionId ? { institution: { connect: { id: data.institutionId } } } : {}),
        bankAccount: { create: { balance } }
      },
      include: { bankAccount: true }
    });
  }
}

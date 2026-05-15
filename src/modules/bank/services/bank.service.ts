import { BankRepository } from '../repositories/bank.repository.js';
import type { CreateBankAccountDto } from '../schemas/bank.schema.js';

export class BankService {
  constructor(private readonly repository = new BankRepository()) {}
  list(userId: string) {
    return this.repository.listAccounts(userId);
  }
  create(userId: string, dto: CreateBankAccountDto) {
    return this.repository.createBankAccount(
      userId,
      {
        name: dto.name,
        type: dto.type,
        currency: dto.currency,
        ...(dto.institutionId ? { institutionId: dto.institutionId } : {})
      },
      dto.balance,
    );
  }
}

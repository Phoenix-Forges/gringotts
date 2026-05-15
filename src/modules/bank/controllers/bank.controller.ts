import type { Request } from '@hapi/hapi';
import { getAuth } from '../../../shared/http/auth.js';
import { BankService } from '../services/bank.service.js';
import type { CreateBankAccountDto } from '../schemas/bank.schema.js';

export class BankController {
  constructor(private readonly service = new BankService()) {}
  list = (request: Request) => this.service.list(getAuth(request).userId);
  create = (request: Request) => this.service.create(getAuth(request).userId, request.payload as CreateBankAccountDto);
}


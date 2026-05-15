import { PrismaClient, AssetType, Currency, InstitutionType, AccountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'owner@gringotts.local' },
    update: {},
    create: { email: 'owner@gringotts.local', name: 'Portfolio Owner', passwordHash }
  });

  const institution = await prisma.institution.upsert({
    where: { name_type: { name: 'Manual Holdings', type: InstitutionType.MANUAL } },
    update: {},
    create: { name: 'Manual Holdings', type: InstitutionType.MANUAL, code: 'MANUAL' }
  });

  const account = await prisma.account.upsert({
    where: { userId_externalRef: { userId: user.id, externalRef: 'seed:manual-brokerage' } },
    update: {},
    create: {
      userId: user.id,
      institutionId: institution.id,
      name: 'Manual Brokerage',
      type: AccountType.BROKERAGE,
      currency: Currency.INR,
      externalRef: 'seed:manual-brokerage'
    }
  });

  const asset = await prisma.asset.upsert({
    where: { symbol_type: { symbol: 'INFY.NS', type: AssetType.INDIAN_STOCK } },
    update: {},
    create: {
      symbol: 'INFY.NS',
      name: 'Infosys Limited',
      type: AssetType.INDIAN_STOCK,
      currency: Currency.INR,
      exchange: 'NSE',
      isin: 'INE009A01021'
    }
  });

  await prisma.holding.upsert({
    where: { userId_assetId_accountId: { userId: user.id, assetId: asset.id, accountId: account.id } },
    update: {},
    create: {
      userId: user.id,
      accountId: account.id,
      assetId: asset.id,
      quantity: '10',
      averageCost: '1400',
      investedValue: '14000'
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

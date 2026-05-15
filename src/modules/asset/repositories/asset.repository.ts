import type { Asset, Prisma } from '@prisma/client';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class AssetRepository {
  list(): Promise<Asset[]> {
    return prisma.asset.findMany({ where: { deletedAt: null }, orderBy: { symbol: 'asc' } });
  }

  create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return prisma.asset.create({ data });
  }

  findBySymbol(symbol: string): Promise<Asset | null> {
    return prisma.asset.findFirst({ where: { symbol, deletedAt: null } });
  }
}


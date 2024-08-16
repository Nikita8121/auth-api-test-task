import { Prisma } from '@prisma/client';

export interface ICrud<ENTITY> {
  create: (
    entity: ENTITY,
    transaction?: Prisma.TransactionClient,
  ) => Promise<ENTITY>;
  update: (
    entity: ENTITY,
    transaction?: Prisma.TransactionClient,
  ) => Promise<ENTITY>;
  delete?: (
    id: number,
    transaction?: Prisma.TransactionClient,
  ) => Promise<ENTITY>;
  findById?: (
    id: number,
    transaction?: Prisma.TransactionClient,
  ) => Promise<ENTITY | null>;
  listAndCount?: (
    page: number,
    count: number,
    criterias?: unknown,
    transaction?: Prisma.TransactionClient,
  ) => Promise<[ENTITY[], number]>;
  findByCriteria: (
    dto: Partial<ENTITY>,
    transaction?: Prisma.TransactionClient,
  ) => Promise<ENTITY[]>;
}

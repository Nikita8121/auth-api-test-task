import { Injectable } from '@nestjs/common';
import { ICrud } from 'src/common/interface/crud.interface';
import { PrismaService } from 'src/database/prisma.service';
import { AuthTokenEntity } from './entities/auth-token.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthTokenRepository implements ICrud<AuthTokenEntity> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    entity: AuthTokenEntity,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.authToken.create({ data: entity });
    return new AuthTokenEntity(model);
  }

  async findByDeviceId(
    deviceId: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity | null> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.authToken.findFirst({
      where: { deviceId },
    });
    return model ? new AuthTokenEntity(model) : null;
  }

  async deleteByDeviceId(
    deviceId: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.authToken.delete({
      where: { deviceId },
    });
    return new AuthTokenEntity(model);
  }

  async update(
    entity: AuthTokenEntity,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity> {
    const prisma = transaction || this.prismaService;
    const { id, ...rest } = entity;
    const model = await prisma.authToken.update({
      where: { id },
      data: rest,
    });
    return new AuthTokenEntity(model);
  }

  async delete(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.authToken.delete({ where: { id } });
    return new AuthTokenEntity(model);
  }

  async findById(id: number): Promise<AuthTokenEntity> {
    const model = await this.prismaService.authToken.findFirst({
      where: { id },
    });

    return new AuthTokenEntity(model);
  }

  async listAndCount(
    page: number,
    count: number,
    criterias?: Partial<AuthTokenEntity>,
    transaction?: Prisma.TransactionClient,
  ): Promise<[AuthTokenEntity[], number]> {
    const prisma = transaction || this.prismaService;
    const skip = (page - 1) * count;
    const [models, total] = await Promise.all([
      prisma.authToken.findMany({
        where: criterias,
        skip,
        take: count,
      }),
      prisma.authToken.count({ where: criterias }),
    ]);
    return [models.map((model) => new AuthTokenEntity(model)), total];
  }

  async findByCriteria(
    dto: Partial<AuthTokenEntity>,
    transaction?: Prisma.TransactionClient,
  ): Promise<AuthTokenEntity[]> {
    const prisma = transaction || this.prismaService;
    const models = await prisma.authToken.findMany({
      where: { ...dto },
    });
    return models.map((model) => new AuthTokenEntity(model));
  }
}

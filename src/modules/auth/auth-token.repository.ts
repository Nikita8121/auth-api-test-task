import { Injectable } from '@nestjs/common';
import { ICrud } from 'src/common/interface/crud.interface';
import { PrismaService } from 'src/database/prisma.service';
import { AuthTokenEntity } from './entities/auth-token.entity';
import { Prisma } from '@prisma/client';
import { getPaginationSkip } from 'src/common/helpers/get-pagination-skip.helper';

@Injectable()
export class AuthTokenRepository implements ICrud<AuthTokenEntity> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: AuthTokenEntity): Promise<AuthTokenEntity> {
    const model = await this.prismaService.authToken.create({ data: entity });
    return new AuthTokenEntity(model);
  }

  async findByDeviceId(deviceId: string): Promise<AuthTokenEntity | null> {
    const model = await this.prismaService.authToken.findFirst({
      where: { deviceId },
    });
    return model ? new AuthTokenEntity(model) : null;
  }

  async deleteByDeviceId(deviceId: string): Promise<AuthTokenEntity> {
    const model = await this.prismaService.authToken.delete({
      where: { deviceId },
    });
    return new AuthTokenEntity(model);
  }

  async update(entity: AuthTokenEntity): Promise<AuthTokenEntity> {
    const { id, ...rest } = entity;
    const model = await this.prismaService.authToken.update({
      where: { id },
      data: rest,
    });
    return new AuthTokenEntity(model);
  }

  async delete(id: number): Promise<AuthTokenEntity> {
    const model = await this.prismaService.authToken.delete({ where: { id } });
    return new AuthTokenEntity(model);
  }

  async findById(id: number): Promise<AuthTokenEntity | null> {
    const model = await this.prismaService.authToken.findFirst({
      where: { id },
    });

    return model ? new AuthTokenEntity(model) : null;
  }

  async listAndCount(
    page: number,
    count: number,
    criterias?: Partial<AuthTokenEntity>,
  ): Promise<[AuthTokenEntity[], number]> {
    const skip = getPaginationSkip(page, count);
    const [models, total] = await Promise.all([
      this.prismaService.authToken.findMany({
        where: criterias,
        skip,
        take: count,
      }),
      this.prismaService.authToken.count({ where: criterias }),
    ]);
    return [models.map((model) => new AuthTokenEntity(model)), total];
  }

  async findByCriteria(
    dto: Partial<AuthTokenEntity>,
  ): Promise<AuthTokenEntity[]> {
    const models = await this.prismaService.authToken.findMany({
      where: { ...dto },
    });
    return models.map((model) => new AuthTokenEntity(model));
  }
}

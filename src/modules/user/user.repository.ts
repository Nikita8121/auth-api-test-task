import { Injectable } from '@nestjs/common';
import { ICrud } from 'src/common/interface/crud.interface';
import { UserEntity } from './entites/user.entity';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository implements ICrud<UserEntity> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    entity: UserEntity,
    transaction?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const prisma = transaction || this.prismaService;
    const createdUser = await prisma.user.create({ data: entity });
    return new UserEntity(createdUser);
  }

  async update(
    entity: UserEntity,
    transaction?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const prisma = transaction || this.prismaService;
    const { id, ...updateData } = entity;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return new UserEntity(updatedUser);
  }

  async delete(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const prisma = transaction || this.prismaService;
    const deletedUser = await prisma.user.delete({ where: { id } });
    return new UserEntity(deletedUser);
  }

  async findById(
    id: string,
    transaction?: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.user.findUnique({ where: { id } });
    if (!model) {
      throw new Error('User not found');
    }
    return new UserEntity(model);
  }

  async listAndCount(
    page: number,
    count: number,
    criterias?: Partial<UserEntity>,
    transaction?: Prisma.TransactionClient,
  ): Promise<[UserEntity[], number]> {
    const prisma = transaction || this.prismaService;
    const skip = (page - 1) * count;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: criterias,
        skip,
        take: count,
      }),
      prisma.user.count({ where: criterias }),
    ]);
    return [users.map((user) => new UserEntity(user)), total];
  }

  async findByCriteria(
    dto: Partial<UserEntity>,
    transaction?: Prisma.TransactionClient,
  ): Promise<UserEntity[]> {
    const prisma = transaction || this.prismaService;
    const users = await prisma.user.findMany({ where: dto });
    return users.map((user) => new UserEntity(user));
  }
}

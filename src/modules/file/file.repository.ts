import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICrud } from 'src/common/interface/crud.interface';
import { FileEntity } from './entities/file.entity';
import { PrismaService } from 'src/database/prisma.service';
import { getPaginationSkip } from 'src/common/helpers/get-pagination-skip.helper';

@Injectable()
export class FileRepository implements ICrud<FileEntity> {
  constructor(private readonly prismaService: PrismaService) {}

  async create(entity: FileEntity): Promise<FileEntity> {
    const model = await this.prismaService.file.create({
      data: {
        ...entity,
      },
    });

    return new FileEntity(model);
  }

  async update(entity: FileEntity): Promise<FileEntity> {
    const model = await this.prismaService.file.update({
      where: { id: entity.id },
      data: {
        ...entity,
      },
    });

    return new FileEntity(model);
  }

  async delete(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<FileEntity> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.file.delete({
      where: { id },
    });

    return new FileEntity(model);
  }

  async findById(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<FileEntity | null> {
    const prisma = transaction || this.prismaService;
    const model = await prisma.file.findUnique({
      where: { id },
    });

    return model ? new FileEntity(model) : null;
  }

  async listAndCount(
    page: number,
    count: number,
  ): Promise<[FileEntity[], number]> {
    const skip = getPaginationSkip(page, count);
    const [files, total] = await Promise.all([
      this.prismaService.file.findMany({
        skip,
        take: count,
      }),
      this.prismaService.file.count({}),
    ]);

    return [files.map((f) => new FileEntity(f)), total];
  }

  async findByCriteria(dto: Partial<FileEntity>): Promise<FileEntity[]> {
    const models = await this.prismaService.file.findMany({
      where: dto,
    });

    return models.map((model) => new FileEntity(model));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/integrations/s3/s3.service';
import { FileRepository } from './file.repository';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const { originalname, mimetype, size, buffer } = file;
    const s3Key = `${Date.now()}-${originalname}`;

    const s3Url = await this.s3Service.uploadFile(file, s3Key);

    const fileEntity = new FileEntity({
      name: originalname,
      mimeType: mimetype,
      size,
      url: s3Url,
      s3Key,
    });

    const newFile = await this.fileRepository.create(fileEntity);

    return newFile;
  }

  async listAndCount(
    page: number,
    count: number,
  ): Promise<{ files: FileEntity[]; total: number }> {
    const [files, total] = await this.fileRepository.listAndCount(page, count);

    return { files, total };
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.s3Service.deleteFile(file.s3Key);
    await this.fileRepository.delete(file.id);
  }

  async getFileInfo(id: number): Promise<FileEntity> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async downloadFile(id: number): Promise<{ file: Buffer; filename: string }> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    const fileBuffer = await this.s3Service.getFileBuffer(file.s3Key);
    return { file: fileBuffer, filename: file.name };
  }

  async updateFile(
    id: number,
    newFile: Express.Multer.File,
  ): Promise<FileEntity> {
    const existingFile = await this.fileRepository.findById(id);
    if (!existingFile) {
      throw new NotFoundException('File not found');
    }

    // Delete old file from S3
    await this.s3Service.deleteFile(existingFile.s3Key);

    // Upload new file to S3
    const { originalname, mimetype, size } = newFile;
    const key = `${Date.now()}-${originalname}`;

    const s3Url = await this.s3Service.uploadFile(newFile, key);

    existingFile.update({
      name: originalname,
      mimeType: mimetype,
      size,
      url: s3Url,
      s3Key: key,
    });

    return this.fileRepository.update(existingFile);
  }
}

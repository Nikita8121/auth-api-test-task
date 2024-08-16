import { File } from '@prisma/client';

export class FileEntity implements File {
  id: number;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FileEntity>) {
    Object.assign(this, partial);
  }

  update({}: {
    name: string;
    url: string;
    mimeType: string;
    size: number;
    s3Key: string;
  }) {}
}

import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
    };

    try {
      const { Body } = await this.s3.getObject(params).promise();
      if (Body instanceof Buffer) {
        return Body;
      } else {
        throw new Error('Retrieved object is not a Buffer');
      }
    } catch (error) {
      console.error('Error retrieving file from S3:', error);
      throw error;
    }
  }
}

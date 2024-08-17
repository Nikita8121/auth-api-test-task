import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';
import {
  GetFileListRequestDto,
  GetFileListResponseDto,
} from './dto/get-file-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.fileService.uploadFile(file);

    return {
      success: true,
    };
  }

  @Get('list')
  async listAnsCount(
    @Query() { page, count }: GetFileListRequestDto,
  ): Promise<GetFileListResponseDto> {
    const { files, total } = await this.fileService.listAndCount(page, count);

    return {
      data: {
        list: files,
        total: total,
      },
    };
  }

  @Delete('delete/:id')
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    await this.fileService.deleteFile(id);

    return { success: true };
  }

  @Get(':id')
  async getFileInfo(@Param('id', ParseIntPipe) id: number) {
    const data = await this.fileService.getFileInfo(id);

    return {
      data,
    };
  }

  @Get('download/:id')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { file, filename } = await this.fileService.downloadFile(id);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(file);
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.fileService.updateFile(id, file);

    return {
      success: true,
    };
  }
}

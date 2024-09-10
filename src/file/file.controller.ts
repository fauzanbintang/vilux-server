import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
  Param,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/dto/response/file.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file')
@Controller('/api/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('sertificates')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files', 2))
  async mergeImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseDto<FileDto>> {
    const frame = files[0];
    const content = files[1];
    const sertificate = await this.fileService.mergeImages(
      frame.buffer,
      content.buffer,
    );
    return { data: sertificate };
  }

  @Post('uploads')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<FileDto>> {
    const savedFileData = await this.fileService.upload(file);

    return {
      data: savedFileData,
    };
  }

  @Post('bulk-uploads')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ResponseDto<FileDto[]>> {
    const savedFiles = await this.fileService.uploadFiles(files);
    return savedFiles;
  }

  @Get(':id')
  @HttpCode(200)
  async getFile(@Param('id') id: string): Promise<ResponseDto<FileDto>> {
    const file = await this.fileService.findById(id);
    return { data: file };
  }
}

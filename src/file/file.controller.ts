import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
  Param,
  Res,
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

  @Get('/open/:fileName')
  @HttpCode(200)
  async openFile(@Param('fileName') fileName: string, @Res() res) {
    return await this.fileService.openFile(fileName, res);
  }

  @Get(':id')
  @HttpCode(200)
  async getFile(@Param('id') id: string): Promise<ResponseDto<FileDto>> {
    const file = await this.fileService.findById(id);
    return { data: file };
  }
}

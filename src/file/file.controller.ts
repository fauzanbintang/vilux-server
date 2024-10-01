import {
  Controller,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/dto/response/file.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCertificateDto, FileUploadDto, FilesUploadDto } from 'src/dto/request/file.dto';

@ApiTags('file')
@Controller('/api/files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('uploads')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiResponse({
    status: 201,
    description: 'The file has been uploaded successfully.',
    schema: {
      example: {
        message: 'File uploaded successfully',
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          path: '/testfile.png',
          file_name: 'testfile.png',
          url: 'https://ik.imagekit.io/users/testfile.png',
          updated_at: '2024-09-10T08:21:41.495Z',
          created_at: '2024-09-10T08:21:41.495Z',
        },
        errors: null,
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<FileDto>> {
    const savedFileData = await this.fileService.upload(file);

    return {
      message: 'File uploaded successfully',
      data: savedFileData,
      errors: null,
    };
  }

  @Post('bulk-upload')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilesUploadDto })
  @ApiResponse({
    status: 201,
    description: 'The files have been uploaded successfully.',
    schema: {
      example: {
        message: 'Files uploaded successfully',
        data: [
          {
            id: '00000000-0000-0000-0000-000000000000',
            path: '/testfile.png',
            file_name: 'testfile.png',
            url: 'https://ik.imagekit.io/users/testfile.png',
            updated_at: '2024-09-10T08:21:41.495Z',
            created_at: '2024-09-10T08:21:41.495Z',
          },
          {
            id: '00000000-0000-0000-0000-000000000001',
            path: '/testfile1.png',
            file_name: 'testfile1.png',
            url: 'https://ik.imagekit.io/users/testfile1.png',
            updated_at: '2024-09-10T08:21:41.495Z',
            created_at: '2024-09-10T08:21:41.495Z',
          },
        ],
        errors: null,
      },
    },
  })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ResponseDto<FileDto[]>> {
    const savedFiles = await this.fileService.uploadFiles(files);

    return {
      message: 'Files uploaded successfully',
      data: savedFiles,
      errors: null,
    };
  }

  @Post('certificates')
  @HttpCode(201)
  @ApiOperation({
    summary:
      'Creates a new certificate by merging frame and content images',
  })
  @ApiResponse({
    status: 201,
    description: 'The certificate has been created successfully.',
    schema: {
      example: {
        message: 'Certificate created successfully',
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          path: '/testfile.png',
          file_name: 'testfile.png',
          url: 'https://ik.imagekit.io/users/testfile.png',
          updated_at: '2024-09-10T08:21:41.495Z',
          created_at: '2024-09-10T08:21:41.495Z',
        },
        errors: null,
      },
    },
  })
  async mergeImages(
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<ResponseDto<FileDto>> {
    const certificate = await this.fileService.mergeImages(
      createCertificateDto
    );

    return {
      message: 'Certificate created successfully',
      data: certificate,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getFile(@Param('id') id: string): Promise<ResponseDto<FileDto>> {
    const file = await this.fileService.findById(id);

    return { data: file };
  }
}

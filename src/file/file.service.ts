import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { extname } from 'path';
import { createReadStream, promises as fs } from 'fs';
import ImageKit from 'imagekit';

@Injectable()
export class FileService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('IMAGEKIT') private readonly imagekit: ImageKit,
  ) {}

  private readonly allowedExtensions = ['.jpg', '.png', '.jpeg']; // Add allowed extensions
  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB (adjust as needed)

  async upload(file: Express.Multer.File) {
    this.logger.debug(`Upload file ${JSON.stringify(file)}`);

    const fileExt = extname(file.originalname).toLowerCase();

    if (!this.allowedExtensions.includes(fileExt)) {
      throw new HttpException('Unsupported file type', 400);
    }

    if (file.size > this.maxFileSize) {
      throw new HttpException('File size exceeds the limit', 400);
    }

    const fileName = file.originalname.replace(/\s+/g, '_');

    try {
      const imagekit = await this.imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: fileName,
      });

      const newFile = await this.prismaService.file.create({
        data: {
          file_name: imagekit.name,
          path: imagekit.filePath,
          url: imagekit.url,
        },
      });

      return newFile;
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error),
        error.getStatus() ? error.getStatus() : 500,
      );
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<any> {
    this.logger.debug(`Upload files ${JSON.stringify(files)}`);

    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          const fileExt = extname(file.originalname).toLowerCase();

          if (!this.allowedExtensions.includes(fileExt)) {
            throw new HttpException('Unsupported file type', 400);
          }

          if (file.size > this.maxFileSize) {
            throw new HttpException('File size exceeds the limit', 400);
          }

          const fileName = file.originalname.replace(/\s+/g, '_');

          const imagekit = await this.imagekit.upload({
            file: file.buffer.toString('base64'),
            fileName: fileName,
          });

          return {
            file_name: imagekit.name,
            path: imagekit.filePath,
            url: imagekit.url,
          };
        }),
      );

      await this.prismaService.file.createMany({
        data: fileData,
        skipDuplicates: true,
      });

      const insertedFiles = await this.prismaService.file.findMany({
        where: {
          path: { in: fileData.map((file) => file.path) },
        },
      });

      return insertedFiles;
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error),
        error.getStatus() ? error.getStatus() : 500,
      );
    }
  }

  async findById(id: string) {
    const file = await this.prismaService.file.findFirst({
      where: { id },
    });

    if (!file) {
      throw new HttpException('File not found', 404);
    }

    return file;
  }

  async openFile(fileName: string, res) {
    const file = await this.prismaService.file.findFirst({
      where: { file_name: fileName },
    });

    const fileUrl = file.url;

    if (!fileUrl) {
      throw new HttpException('File not found', 404);
    }

    const fileStream = createReadStream(fileUrl);
    const contentType = 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileUrl}"`);

    return fileStream.pipe(res);
  }
}

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { extname } from 'path';
import ImageKit from 'imagekit';
import sharp from 'sharp';
import { log } from 'console';

@Injectable()
export class FileService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('IMAGEKIT') private readonly imagekit: ImageKit,
  ) {}

  private readonly allowedExtensions = ['.jpg', '.png', '.jpeg']; // Add allowed extensions
  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB (adjust as needed)

  async mergeImages(frameId: string, contentBuffer: Buffer) {
    try {
      const resizedContentBuffer = await sharp(contentBuffer)
        .resize({
          width: 1080,
          height: 1920,
          fit: 'contain',
        })
        .toBuffer();

      const frame = await this.prismaService.file.findUnique({
        where: {
          id: frameId,
        },
      });

      if (!frame) {
        throw new HttpException('Frame not found', 404);
      }

      const frameBuffer = await fetch(frame.url).then((res) =>
        res.arrayBuffer(),
      );

      const mergedImage = await sharp(resizedContentBuffer)
        .composite([{ input: Buffer.from(frameBuffer), gravity: 'center' }])
        .toBuffer();

      const imagekit = await this.imagekit.upload({
        file: mergedImage.toString('base64'),
        fileName: `certificate-${Date.now()}`,
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
      console.log(error, 'AFSFAS');

      throw new HttpException(error.message, 500);
    }
  }

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
    try {
      const file = await this.prismaService.file.findUnique({
        where: { id },
      });

      if (!file) {
        throw new HttpException('File not found', 404);
      }

      return file;
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error),
        error.getStatus() ? error.getStatus() : 500,
      );
    }
  }
}

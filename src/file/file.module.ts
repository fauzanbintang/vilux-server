import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ImageKitProvider } from './imagekit.provider';

@Module({
  controllers: [FileController],
  providers: [FileService, ImageKitProvider],
  exports: [FileService],
})
export class FileModule {}

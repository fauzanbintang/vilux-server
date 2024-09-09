import { Inject, Injectable, Logger } from '@nestjs/common';
import { LegitCheckStatus, LegitStatus } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  LegitCheckBrandCategoryDto,
  LegitCheckImagesDto,
} from 'src/dto/request/legit_check.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';

@Injectable()
export class LegitCheckService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async upsertLegitCheckBrandCategory(
    brandCategoryDto: LegitCheckBrandCategoryDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Upsert legit check: brand category ${JSON.stringify(brandCategoryDto)}`,
    );

    var legitCheck: LegitCheckDto;

    if (brandCategoryDto.id.length !== 0) {
      legitCheck = await this.prismaService.legitChecks.update({
        where: { id: brandCategoryDto.id },
        data: brandCategoryDto,
      });
    } else {
      legitCheck = await this.prismaService.legitChecks.create({
        data: {
          brand_id: brandCategoryDto.brand_id,
          category_id: brandCategoryDto.category_id,
          check_status: LegitCheckStatus.brand_category,
        },
      });
    }

    return legitCheck;
  }

  async upsertLegitCheckImages(
    id: string,
    legitCheckImagesDto: LegitCheckImagesDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Upsert legit check: images ${JSON.stringify(legitCheckImagesDto)}`,
    );

    legitCheckImagesDto.legit_check_images.forEach(async (v) => {
      await this.prismaService.legitCheckImages.upsert({
        where: { id: v.legit_check_image_id },
        update: {
          name: v.name,
          legit_check_id: id,
          file_id: v.file_id,
        },
        create: {
          name: v.name,
          legit_check_id: id,
          file_id: v.file_id,
        },
      });
    });

    let legitCheck: LegitCheckDto = await this.prismaService.legitChecks.update(
      {
        where: { id },
        data: {
          product_name: legitCheckImagesDto.product_name,
          client_note: legitCheckImagesDto.client_note,
        },
      },
    );

    return legitCheck;
  }
}

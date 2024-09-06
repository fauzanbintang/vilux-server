import { Body, Controller, HttpCode, Param, Post, Put } from '@nestjs/common';
import { LegitCheckService } from './legit_check.service';
import { ApiTags } from '@nestjs/swagger';
import {
  LegitCheckBrandCategoryDto,
  LegitCheckImagesDto,
} from 'src/dto/request/legit_check.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';

@ApiTags('legit-check')
@Controller('api/legit-checks')
export class LegitCheckController {
  constructor(private readonly legitCheckService: LegitCheckService) {}

  @Post('brand-category')
  @HttpCode(201)
  async upsertLegitCheckBrandCategory(
    @Body() brandCategoryDto: LegitCheckBrandCategoryDto,
  ): Promise<LegitCheckDto> {
    const legitCheck =
      await this.legitCheckService.upsertLegitCheckBrandCategory(
        brandCategoryDto,
      );

    return legitCheck;
  }

  @Put(':id/images')
  @HttpCode(200)
  async upsertLegitCheckImages(
    @Param('id') id: string,
    @Body() legitCheckImagesDto: LegitCheckImagesDto,
  ): Promise<LegitCheckDto> {
    const legitCheck = await this.legitCheckService.upsertLegitCheckImages(
      id,
      legitCheckImagesDto,
    );

    return legitCheck;
  }
}

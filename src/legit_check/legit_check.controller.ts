import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LegitCheckService } from './legit_check.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LegitCheckBrandCategoryDto,
  LegitCheckImagesDto,
  LegitCheckPaginationQuery,
} from 'src/dto/request/legit_check.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';
import { ResponseDto } from 'src/dto/response/response.dto';

@ApiTags('legit-check')
@Controller('api/legit-checks')
export class LegitCheckController {
  constructor(private readonly legitCheckService: LegitCheckService) {}

  @Post('brand-category')
  @HttpCode(201)
  @ApiOperation({ summary: 'Upsert legit check brand and category' })
  @ApiResponse({
    status: 201,
    description: 'Upsert legit check brand and category',
    schema: {
      example: {
        message: 'Legit check successfully created or updated',
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          brand_id: '123e4567-e89b-12d3-a456-426614174001',
          category_id: '123e4567-e89b-12d3-a456-426614174002',
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async upsertLegitCheckBrandCategory(
    @Req() req: Request,
    @Body() brandCategoryDto: LegitCheckBrandCategoryDto,
  ): Promise<ResponseDto<LegitCheckDto>> {
    const legitCheck =
      await this.legitCheckService.upsertLegitCheckBrandCategory(
        req.user,
        brandCategoryDto,
      );

    return {
      message: 'Successfully upsert legit check',
      data: {
        id: legitCheck.id,
        brand_id: legitCheck.brand_id,
        category_id: legitCheck.category_id,
      },
      errors: null,
    };
  }

  @Put(':id/images')
  @HttpCode(200)
  @ApiOperation({ summary: 'Upsert legit check images' })
  @ApiResponse({
    status: 200,
    description: 'Upsert legit check images',
    schema: {
      example: {
        message: 'Successfully upsert legit check images',
        data: {
          id: '3b2a2e7d-9637-4a93-95d9-4f9f27992fa6',
          updated_at: '2024-09-13T09:24:49.326Z',
          created_at: '2024-09-12T17:01:35.059Z',
          brand_id: '4c2cd434-4afc-41e3-8077-32c8939df322',
          category_id: '9aa84aac-954c-409f-9b90-188bc7a11e0e',
          check_status: 'upload_data',
          product_name: 'Nike Cortez',
          legit_status: null,
          client_note: 'This is client note',
          admin_note: null,
          cover_id: null,
          certificate_id: null,
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async upsertLegitCheckImages(
    @Param('id') id: string,
    @Body() legitCheckImagesDto: LegitCheckImagesDto,
  ): Promise<ResponseDto<LegitCheckDto>> {
    const legitCheck = await this.legitCheckService.upsertLegitCheckImages(
      id,
      legitCheckImagesDto,
    );

    return {
      message: 'Successfully upsert legit check images',
      data: legitCheck,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get paginated legit checks' })
  @ApiResponse({
    status: 200,
    description: 'Get paginated legit checks',
    schema: {
      example: {
        message: 'Successfully get paginated legit checks',
        data: {
          currentPage: 1,
          totalPage: 1,
          legitChecks: [
            {
              id: '4d44f0df-5721-4902-a584-53d52f338e71',
              product_name: null,
              check_status: 'brand_category',
              legit_status: null,
              code: 'NL01J82W951B',
              client: {
                id: '12554611-3fba-42d7-9db4-f79bf12ffb86',
                username: 'test',
                role: 'client',
              },
              category: {
                id: '131d4edb-e004-4cd5-bf11-fde5de0acf39',
                name: 'sneakers',
              },
              LegitCheckImages: [],
              Order: [],
            },
          ],
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getPaginatedLegitChecks(
    @Query() query: LegitCheckPaginationQuery,
  ): Promise<ResponseDto<any>> {
    query.check_status = Array.isArray(query.check_status)
      ? query.check_status
      : [query.check_status];
    const data = await this.legitCheckService.getPaginatedLegitChecks(query);

    return {
      message: 'Successfully get paginated legit checks',
      data: {
        currentPage: +query.page,
        totalPage: Math.ceil(data.count / +query.limit),
        legitChecks: data.legitChecks,
      },
      errors: null,
    };
  }
}

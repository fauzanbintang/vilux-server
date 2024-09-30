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
  LegitCheckCompletedDto,
  LegitCheckImagesDto,
  LegitCheckPaginationQuery,
  LegitCheckValidateDataDto,
} from 'src/dto/request/legit_check.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';
import { ResponseDto } from 'src/dto/response/response.dto';

@ApiTags('legit-check')
@Controller('api/legit-checks')
export class LegitCheckController {
  constructor(private readonly legitCheckService: LegitCheckService) {}

  @Post('brand-category')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Upsert legit check brand, category and subcategory',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully upsert legit check',
    schema: {
      example: {
        message: 'Successfully upsert legit check',
        data: {
          id: '59e4c335-01bc-42db-a742-8b52b010d4f9',
          updated_at: '2024-09-30T13:01:33.011Z',
          created_at: '2024-09-30T13:01:33.011Z',
          client_id: '2ddab221-d4a3-4297-a3d9-3e7ca8d9d2eb',
          code: 'NL01J91GB5YH',
          brand_id: 'f254dcee-11d6-41f8-8bc8-94c9107c0c44',
          category_id: 'fe380803-ea33-4c75-8e04-dd0a3c14c4fa',
          subcategory_id: '64491799-2d05-4212-9335-bc0eb801ad47',
          check_status: 'brand_category',
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
      data: legitCheck,
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
          id: '59e4c335-01bc-42db-a742-8b52b010d4f9',
          updated_at: '2024-09-30T14:02:42.859Z',
          created_at: '2024-09-30T13:01:33.011Z',
          client_id: '2ddab221-d4a3-4297-a3d9-3e7ca8d9d2eb',
          code: 'NL01J91GB5YH',
          brand_id: 'f254dcee-11d6-41f8-8bc8-94c9107c0c44',
          category_id: 'fe380803-ea33-4c75-8e04-dd0a3c14c4fa',
          subcategory_id: '64491799-2d05-4212-9335-bc0eb801ad47',
          check_status: 'upload_data',
          product_name: 'Armani Clutch',
          client_note: 'This is client note',
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

  @Put(':id/validate-data')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update legit check validate data' })
  @ApiResponse({
    status: 200,
    description: 'Update legit check validate data',
    schema: {
      example: {
        message: 'Successfully update legit check validate data',
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
          admin_note: 'This is admin note',
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
  async updateLegitCheckValidateData(
    @Param('id') id: string,
    @Body() legitCheckValidateDataDto: LegitCheckValidateDataDto,
  ): Promise<ResponseDto<LegitCheckDto>> {
    const legitCheck =
      await this.legitCheckService.updateLegitCheckValidateData(
        id,
        legitCheckValidateDataDto,
      );

    return {
      message: 'Successfully update legit check validate data',
      data: legitCheck,
      errors: null,
    };
  }

  @Put(':id/completed')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update legit check completed' })
  @ApiResponse({
    status: 200,
    description: 'Update legit check completed',
    schema: {
      example: {
        message: 'Successfully update legit check completed',
        data: {
          id: '3b2a2e7d-9637-4a93-95d9-4f9f27992fa6',
          updated_at: '2024-09-13T09:24:49.326Z',
          created_at: '2024-09-12T17:01:35.059Z',
          brand_id: '4c2cd434-4afc-41e3-8077-32c8939df322',
          category_id: '9aa84aac-954c-409f-9b90-188bc7a11e0e',
          check_status: 'upload_data',
          product_name: 'Nike Cortez',
          legit_status: 'authentic',
          client_note: 'This is client note',
          admin_note: 'This is admin note',
          cover_id: '3fa84aac-954c-409f-s890-188bc7a1a12y',
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
  async updateLegitCheckCompleted(
    @Param('id') id: string,
    @Body() legitCheckCompletedDto: LegitCheckCompletedDto,
  ): Promise<ResponseDto<LegitCheckDto>> {
    const legitCheck = await this.legitCheckService.updateLegitCheckCompleted(
      id,
      legitCheckCompletedDto,
    );

    return {
      message: 'Successfully update legit check completed',
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
          data: [
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
        data: data.legitChecks,
      },
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get detail legit check' })
  @ApiResponse({
    status: 200,
    description: 'Get detail legit check',
    schema: {
      example: {
        message: 'Successfully get detail legit check',
        data: {
          message: 'Successfully get detail legit check',
          data: {
            id: '4d44f0df-5721-4902-a584-53d52f338e71',
            product_name: null,
            check_status: 'brand_category',
            legit_status: null,
            code: 'NL01J82W951B',
            updated_at: '2024-09-18T15:33:42.061Z',
            client_note: null,
            admin_note: null,
            brand: {
              id: '98af5a95-0889-41d7-805e-b488e975de5e',
              name: 'Nike',
              file: null,
            },
            category: {
              id: '131d4edb-e004-4cd5-bf11-fde5de0acf39',
              name: 'sneakers',
            },
            Order: [],
            LegitCheckImages: [],
            certificate: null,
          },
          errors: null,
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
  async getDetailLegitCheck(
    @Param('id') id: string,
  ): Promise<ResponseDto<any>> {
    const data = await this.legitCheckService.getDetailLegitCheck(id);

    return {
      message: 'Successfully get detail legit check',
      data,
      errors: null,
    };
  }
}

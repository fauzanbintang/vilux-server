import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import {
  BrandPaginationQuery,
  CreateBrandDto,
  UpdateBrandDto,
} from 'src/dto/request/brand.dto';
import { BrandDto } from 'src/dto/response/brand.dto';

@ApiTags('brand')
@Controller('api/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a brand' })
  @ApiResponse({
    status: 201,
    description: 'Create a brand',
    schema: {
      example: {
        message: 'Successfully create a brand',
        data: {
          id: '1873a4df-41cd-4ab0-b49a-94dfaa7473dc',
          name: 'New Balance',
          file_id: '643ec53d-2f63-4108-a9ac-e02aada7f5c0',
          updated_at: '2024-09-21T14:25:14.425Z',
          created_at: '2024-09-21T14:25:14.425Z',
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
  async create(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<ResponseDto<BrandDto>> {
    const data = await this.brandService.create(createBrandDto);

    return {
      message: 'Successfully create a brand',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get paginated brands' })
  @ApiResponse({
    status: 200,
    description: 'Get paginated brands',
    schema: {
      example: {
        message: 'Successfully get paginated brands',
        data: {
          currentPage: 1,
          totalPage: 1,
          data: [
            {
              id: '0593bca4-3c6e-4a73-bd52-78e9122fe72f',
              name: 'Adidas',
              file_id: null,
              updated_at: '2024-09-18T15:29:40.911Z',
              created_at: '2024-09-18T15:29:40.911Z',
              file: null,
            },
            {
              id: 'ba149365-12a5-4723-888b-5b406d31ca70',
              name: 'Gucci',
              file_id: null,
              updated_at: '2024-09-18T15:29:40.911Z',
              created_at: '2024-09-18T15:29:40.911Z',
              file: null,
            },
            {
              id: '92141809-446c-47ce-829f-bfa53489ace4',
              name: 'Nike',
              file_id: 'f9682e0b-0d4e-4eae-9b50-2b77004dc9c7',
              updated_at: '2024-09-18T15:29:40.911Z',
              created_at: '2024-09-18T15:29:40.911Z',
              file: {
                id: 'f9682e0b-0d4e-4eae-9b50-2b77004dc9c7',
                path: '/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
                file_name: 'Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
                url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
              },
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
  async findAll(
    @Query() query: BrandPaginationQuery,
  ): Promise<ResponseDto<any>> {
    const data = await this.brandService.findAll(query);

    return {
      message: 'Successfully get all brands',
      data: {
        currentPage: +query.page,
        totalPage: Math.ceil(data.count / +query.limit),
        data: data.brands,
      },
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get brand detail' })
  @ApiResponse({
    status: 200,
    description: 'Get brand detail',
    schema: {
      example: {
        message: 'Successfully get brand detail',
        data: {
          id: '92141809-446c-47ce-829f-bfa53489ace4',
          name: 'Nike',
          file_id: 'f9682e0b-0d4e-4eae-9b50-2b77004dc9c7',
          updated_at: '2024-09-18T15:29:40.911Z',
          created_at: '2024-09-18T15:29:40.911Z',
          file: {
            id: 'f9682e0b-0d4e-4eae-9b50-2b77004dc9c7',
            path: '/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
            file_name: 'Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
          },
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<BrandDto>> {
    const data = await this.brandService.findOne(id);

    return {
      message: 'Successfully get brand detail',
      data,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a brand' })
  @ApiResponse({
    status: 200,
    description: 'Update a brand',
    schema: {
      example: {
        message: 'Successfully update a brand',
        data: {
          id: '1873a4df-41cd-4ab0-b49a-94dfaa7473dc',
          name: 'New Balance',
          file_id: '643ec53d-2f63-4108-a9ac-e02aada7f5c0',
          updated_at: '2024-09-21T14:25:14.425Z',
          created_at: '2024-09-21T14:25:14.425Z',
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
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<ResponseDto<BrandDto>> {
    const data = await this.brandService.update(id, updateBrandDto);

    return {
      message: 'Successfully update a brand',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a brand' })
  @ApiResponse({
    status: 200,
    description: 'Delete a brand',
    schema: {
      example: {
        message: 'Successfully delete a brand',
        data: null,
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
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.brandService.remove(id);

    return { message: 'Successfully delete a brand', data: null, errors: null };
  }
}

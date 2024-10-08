import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { BannerDto } from 'src/dto/response/banner.dto';
import { CreateBannerDto, UpdateBannerDto } from 'src/dto/request/banner.dto';

@ApiTags('banner')
@Controller('api/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a banner' })
  @ApiResponse({
    status: 201,
    description: 'Create a banner',
    schema: {
      example: {
        message: 'Successfully create a banner',
        data: {
          id: '3a29be9a-1184-4416-85d3-b9fb9fc1e7c8',
          updated_at: '2024-10-08T11:21:30.440Z',
          created_at: '2024-10-08T11:21:30.440Z',
          name: 'Check Legit Tips',
          link: 'https://legitcheck.app/category/guides',
          file_id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
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
    @Body() createBannerDto: CreateBannerDto,
  ): Promise<ResponseDto<BannerDto>> {
    const data = await this.bannerService.create(createBannerDto);

    return {
      message: 'Successfully create a banner',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all banners' })
  @ApiResponse({
    status: 200,
    description: 'Get all banners',
    schema: {
      example: {
        message: 'Successfully get all banners',
        data: [
          {
            id: '3a29be9a-1184-4416-85d3-b9fb9fc1e7c8',
            updated_at: '2024-10-08T11:21:30.440Z',
            created_at: '2024-10-08T11:21:30.440Z',
            name: 'Check Legit Tips',
            link: 'https://legitcheck.app/category/guides',
            file_id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
            file: {
              id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
              path: '/Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
              file_name: 'Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
              url: 'https://ik.imagekit.io/saf16/Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
            },
          },
        ],
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
  async findAll(): Promise<ResponseDto<BannerDto[]>> {
    const data = await this.bannerService.findAll();

    return {
      message: 'Successfully get all banners',
      data,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get banner detail' })
  @ApiResponse({
    status: 200,
    description: 'Get banner detail',
    schema: {
      example: {
        message: 'Successfully get banner detail',
        data: {
          id: '3a29be9a-1184-4416-85d3-b9fb9fc1e7c8',
          updated_at: '2024-10-08T11:21:30.440Z',
          created_at: '2024-10-08T11:21:30.440Z',
          name: 'Check Legit Tips',
          link: 'https://legitcheck.app/category/guides',
          file_id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
          file: {
            id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
            path: '/Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
            file_name: 'Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
            url: 'https://ik.imagekit.io/saf16/Jordan-Jumpman-Jack-min_wJ8NDfXdS.jpg',
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<BannerDto>> {
    const data = await this.bannerService.findOne(id);

    return {
      message: 'Successfully get banner detail',
      data,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a banner' })
  @ApiResponse({
    status: 200,
    description: 'Update a banner',
    schema: {
      example: {
        message: 'Successfully update a banner',
        data: {
          id: '3a29be9a-1184-4416-85d3-b9fb9fc1e7c8',
          updated_at: '2024-10-08T11:49:46.923Z',
          created_at: '2024-10-08T11:21:30.440Z',
          name: 'Check Legit Tips',
          link: 'https://legitcheck.app/category/guides',
          file_id: '6de1508a-a435-4e94-ac94-b52c7f64150a',
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
    @Body() updateBannerDto: UpdateBannerDto,
  ): Promise<ResponseDto<BannerDto>> {
    const data = await this.bannerService.update(id, updateBannerDto);

    return {
      message: 'Successfully update a banner',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a banner' })
  @ApiResponse({
    status: 200,
    description: 'Delete a banner',
    schema: {
      example: {
        message: 'Successfully delete a banner',
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
    await this.bannerService.remove(id);

    return {
      message: 'Successfully delete a banner',
      data: null,
      errors: null,
    };
  }
}

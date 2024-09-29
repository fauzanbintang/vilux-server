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
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from '../dto/request/service.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ServiceDto } from 'src/dto/response/service.dto';

@ApiTags('service')
@Controller('api/service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a service' })
  @ApiResponse({
    status: 201,
    description: 'Create a service',
    schema: {
      example: {
        message: 'Successfully create a service',
        data: {
          id: '1873a4df-41cd-4ab0-b49a-94dfaa7473dc',
          name: 'fast checking',
          working_hours: 3,
          normal_price: 195000,
          vip_price: 160000,
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
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ResponseDto<ServiceDto>> {
    const data = await this.serviceService.create(createServiceDto);

    return {
      message: 'Successfully create a service',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({
    status: 200,
    description: 'Get all services',
    schema: {
      example: {
        message: 'Successfully get all services',
        data: [
          {
            id: '000fd1be-5288-4c83-aa0e-6aa7ae5eb7a4',
            updated_at: '2024-09-29T16:31:24.068Z',
            created_at: '2024-09-29T16:31:24.068Z',
            name: 'fast checking',
            working_hours: 3,
            normal_price: '195000',
            vip_price: '160000',
            file_id: 'e81d1f00-0f74-45ba-b43b-aaa2326fb3d2',
            file: {
              id: 'e81d1f00-0f74-45ba-b43b-aaa2326fb3d2',
              path: '/Screenshot_from_2024-09-28_20-03-50_SSJsv51Jn.png',
              file_name: 'Screenshot_from_2024-09-28_20-03-50_SSJsv51Jn.png',
              url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-28_20-03-50_SSJsv51Jn.png',
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
  async findAll(): Promise<ResponseDto<ServiceDto[]>> {
    const data = await this.serviceService.findAll();

    return {
      message: 'Successfully get all services',
      data,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get service detail' })
  @ApiResponse({
    status: 200,
    description: 'Get service detail',
    schema: {
      example: {
        message: 'Successfully get service detail',
        data: {
          id: '1873a4df-41cd-4ab0-b49a-94dfaa7473dc',
          name: 'fast checking',
          working_hours: 3,
          normal_price: 195000,
          vip_price: 160000,
          file: {
            id: 'f9682e0b-0d4e-4eae-9b50-2b77004dc9c7',
            path: '/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
            file_name: 'Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-21_20-25-16_RLIHs9JUC.png',
          },
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<ServiceDto>> {
    const data = await this.serviceService.findOne(id);

    return {
      message: 'Successfully get service detail',
      data,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({
    status: 200,
    description: 'Update a service',
    schema: {
      example: {
        message: 'Successfully update a service',
        data: {
          id: '1873a4df-41cd-4ab0-b49a-94dfaa7473dc',
          name: 'fast checking',
          working_hours: 3,
          normal_price: 195000,
          vip_price: 160000,
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
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ResponseDto<ServiceDto>> {
    const data = await this.serviceService.update(id, updateServiceDto);

    return {
      message: 'Successfully update a service',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({
    status: 200,
    description: 'Delete a service',
    schema: {
      example: {
        message: 'Successfully delete a service',
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
    await this.serviceService.remove(id);

    return {
      message: 'Successfully delete a service',
      data: null,
      errors: null,
    };
  }
}

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
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/dto/request/category.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { CategoryDto } from 'src/dto/response/category.dto';

@ApiTags('category')
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({
    status: 201,
    description: 'Create a category',
    schema: {
      example: {
        message: 'Successfully create a category',
        data: {
          id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          updated_at: '2024-09-26T15:42:05.952Z',
          created_at: '2024-09-26T15:42:05.952Z',
          name: 'footwear',
          file_id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
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
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.create(createCategoryDto);

    return {
      message: 'Successfully create a category',
      data: category,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Get all categories',
    schema: {
      example: {
        message: 'Successfully get all categories',
        data: [
          {
            id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
            updated_at: '2024-09-26T15:42:05.952Z',
            created_at: '2024-09-26T15:42:05.952Z',
            name: 'footwear',
            file_id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
            file: {
              id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
              path: '/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
              file_name: 'Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
              url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
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
  async findAll(): Promise<ResponseDto<CategoryDto[]>> {
    const categories = await this.categoryService.findAll();

    return {
      message: 'Successfully get all categories',
      data: categories,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get category detail' })
  @ApiResponse({
    status: 200,
    description: 'Get category detail',
    schema: {
      example: {
        message: 'Successfully get category detail',
        data: {
          id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          updated_at: '2024-09-26T15:42:05.952Z',
          created_at: '2024-09-26T15:42:05.952Z',
          name: 'footwear',
          file_id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
          file: {
            id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
            path: '/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
            file_name: 'Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.findOne(id);

    return {
      message: 'Successfully get category detail',
      data: category,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Update a category',
    schema: {
      example: {
        message: 'Successfully update a category',
        data: {
          id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          updated_at: '2024-09-26T15:45:10.169Z',
          created_at: '2024-09-26T15:42:05.952Z',
          name: 'footwear',
          file_id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
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
    @Body() UpdateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.update(id, UpdateCategoryDto);

    return {
      message: 'Successfully update a category',
      data: category,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: 200,
    description: 'Delete a category',
    schema: {
      example: {
        message: 'Successfully delete a category',
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
    await this.categoryService.remove(id);

    return {
      message: 'Successfully delete a category',
      data: null,
      errors: null,
    };
  }
}

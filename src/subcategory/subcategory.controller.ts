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
import { SubcategoryService } from './subcategory.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from 'src/dto/request/subcategory.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { SubcategoryDto } from 'src/dto/response/subcategory.dto';

@ApiTags('subcategory')
@Controller('api/subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a subcategory' })
  @ApiResponse({
    status: 201,
    description: 'Create a subcategory',
    schema: {
      example: {
        message: 'Successfully create a subcategory',
        data: {
          id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
          updated_at: '2024-09-26T15:50:03.843Z',
          created_at: '2024-09-26T15:50:03.843Z',
          name: 'sneakers',
          category_id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          file_id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
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
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<ResponseDto<SubcategoryDto>> {
    const subcategory =
      await this.subcategoryService.create(createSubcategoryDto);

    return {
      message: 'Successfully create a subcategory',
      data: subcategory,
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
            id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
            updated_at: '2024-09-26T15:50:03.843Z',
            created_at: '2024-09-26T15:50:03.843Z',
            name: 'sneakers',
            category_id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
            file_id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
            category: {
              id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
              name: 'footwear',
              file: {
                id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
                path: '/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
                file_name: 'Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
                url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
              },
            },
            file: {
              id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
              path: '/Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
              file_name: 'Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
              url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
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
  async findAll(): Promise<ResponseDto<SubcategoryDto[]>> {
    const categories = await this.subcategoryService.findAll();

    return {
      message: 'Successfully get all categories',
      data: categories,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get subcategory detail' })
  @ApiResponse({
    status: 200,
    description: 'Get subcategory detail',
    schema: {
      example: {
        id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
        updated_at: '2024-09-26T15:50:03.843Z',
        created_at: '2024-09-26T15:50:03.843Z',
        name: 'sneakers',
        category_id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
        file_id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
        category: {
          id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          name: 'footwear',
          file: {
            id: '2f6930e8-95e1-4503-ac44-8ce5ab619346',
            path: '/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
            file_name: 'Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-26_19-49-46__AhHkYEYn.png',
          },
        },
        file: {
          id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
          path: '/Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
          file_name: 'Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
          url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-21_21-54-42_da0_Ijjku.png',
        },
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<SubcategoryDto>> {
    const subcategory = await this.subcategoryService.findOne(id);

    return {
      message: 'Successfully get subcategory detail',
      data: subcategory,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiResponse({
    status: 200,
    description: 'Update a subcategory',
    schema: {
      example: {
        message: 'Successfully update a subcategory',
        data: {
          id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
          updated_at: '2024-09-26T15:54:50.014Z',
          created_at: '2024-09-26T15:50:03.843Z',
          name: 'sneakers',
          category_id: '6c8d729c-d1e9-4e29-be38-8af9abf45cbf',
          file_id: '22bc61ae-7f8b-4ef4-8b07-993736cd1ffc',
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
    @Body() UpdateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<ResponseDto<SubcategoryDto>> {
    const subcategory = await this.subcategoryService.update(
      id,
      UpdateSubcategoryDto,
    );

    return {
      message: 'Successfully update a subcategory',
      data: subcategory,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a subcategory' })
  @ApiResponse({
    status: 200,
    description: 'Delete a subcategory',
    schema: {
      example: {
        message: 'Successfully delete a subcategory',
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
    await this.subcategoryService.remove(id);

    return { message: 'successfully delete a subcategory' };
  }
}

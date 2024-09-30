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
import { SubcategoryInstructionService } from './subcategory_instruction.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateSubcategoryInstructionDto,
  SubcategoryInstructionsQuery,
  UpdateSubcategoryInstructionDto,
} from 'src/dto/request/subcategory_instruction.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { SubcategoryInstructionDto } from 'src/dto/response/subcategory_instruction.dto';

@ApiTags('subcategory instruction')
@Controller('api/subcategory_instruction')
export class SubcategoryInstructionController {
  constructor(
    private readonly subcategoryInstructionService: SubcategoryInstructionService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a subcategory instruction' })
  @ApiResponse({
    status: 201,
    description: 'Create a subcategory instruction',
    schema: {
      example: {
        message: 'Successfully create a subcategory instruction',
        data: {
          id: '5ee1b221-0906-40f2-870e-ac704221100a',
          updated_at: '2024-09-30T08:17:46.572Z',
          created_at: '2024-09-30T08:17:46.572Z',
          name: 'Outer Shoes',
          subcategory_id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
          icon_id: '01e23b9f-a115-494c-96cc-3841447c888c',
          example_image_id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
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
    @Body() createSubcategoryInstructionDto: CreateSubcategoryInstructionDto,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const data = await this.subcategoryInstructionService.create(
      createSubcategoryInstructionDto,
    );

    return {
      message: 'Successfully create a subcategory instruction',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all subcategory instructions' })
  @ApiResponse({
    status: 200,
    description: 'Get all subcategory instructions',
    schema: {
      example: {
        message: 'Successfully get all subcategory instructions',
        data: [
          {
            id: '5ee1b221-0906-40f2-870e-ac704221100a',
            updated_at: '2024-09-30T08:17:46.572Z',
            created_at: '2024-09-30T08:17:46.572Z',
            name: 'Outer Shoes',
            subcategory_id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
            icon_id: '01e23b9f-a115-494c-96cc-3841447c888c',
            example_image_id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
            subcategory: {
              id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
              name: 'sneakers',
            },
            icon: {
              id: '01e23b9f-a115-494c-96cc-3841447c888c',
              path: '/Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
              file_name: 'Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
              url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
            },
            example_image: {
              id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
              path: '/Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
              file_name: 'Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
              url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
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
  async findAll(
    @Query() query: SubcategoryInstructionsQuery,
  ): Promise<ResponseDto<SubcategoryInstructionDto[]>> {
    const data = await this.subcategoryInstructionService.findAll(query);

    return {
      message: 'Successfully get all subcategory instructions',
      data,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get subcategory instruction detail' })
  @ApiResponse({
    status: 200,
    description: 'Get subcategory instruction detail',
    schema: {
      example: {
        message: 'Successfully get subcategory instruction detail',
        data: {
          id: '5ee1b221-0906-40f2-870e-ac704221100a',
          updated_at: '2024-09-30T08:17:46.572Z',
          created_at: '2024-09-30T08:17:46.572Z',
          name: 'Outer Shoes',
          subcategory_id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
          icon_id: '01e23b9f-a115-494c-96cc-3841447c888c',
          example_image_id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
          subcategory: {
            id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
            name: 'sneakers',
          },
          icon: {
            id: '01e23b9f-a115-494c-96cc-3841447c888c',
            path: '/Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
            file_name: 'Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-30_14-17-50_fBn5o5rFV.png',
          },
          example_image: {
            id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
            path: '/Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
            file_name: 'Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
            url: 'https://ik.imagekit.io/saf16/Screenshot_from_2024-09-30_11-01-35_mm36lDZoo.png',
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
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const data = await this.subcategoryInstructionService.findOne(id);

    return {
      message: 'Successfully get subcategory instruction detail',
      data,
      errors: null,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a subcategory instruction' })
  @ApiResponse({
    status: 200,
    description: 'Update a subcategory instruction',
    schema: {
      example: {
        message: 'Successfully update a subcategory instruction',
        data: {
          id: '5ee1b221-0906-40f2-870e-ac704221100a',
          updated_at: '2024-09-30T08:17:46.572Z',
          created_at: '2024-09-30T08:17:46.572Z',
          name: 'Outer Shoes',
          subcategory_id: '66001778-ceaa-4e9a-9c4c-12f3569c0987',
          icon_id: '01e23b9f-a115-494c-96cc-3841447c888c',
          example_image_id: '55e86564-4d6b-4fd3-9ddd-1e09f6c2dd27',
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
    @Body() updateSubcategoryInstructionDto: UpdateSubcategoryInstructionDto,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const data = await this.subcategoryInstructionService.update(
      id,
      updateSubcategoryInstructionDto,
    );

    return {
      message: 'Successfully update a subcategory instruction',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a subcategory instruction' })
  @ApiResponse({
    status: 200,
    description: 'Delete a subcategory instruction',
    schema: {
      example: {
        message: 'Successfully delete a subcategory instruction',
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
    await this.subcategoryInstructionService.remove(id);

    return {
      message: 'Successfully delete a subcategory instruction',
      data: null,
      errors: null,
    };
  }
}

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
import { ApiTags } from '@nestjs/swagger';
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
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.create(createCategoryDto);

    return { data: category };
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<CategoryDto[]>> {
    const categories = await this.categoryService.findAll();

    return { data: categories };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.findOne(id);

    return { data: category };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDto<CategoryDto>> {
    const category = await this.categoryService.update(id, UpdateCategoryDto);

    return { data: category };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.categoryService.remove(id);

    return { message: 'successfully delete a category' };
  }
}

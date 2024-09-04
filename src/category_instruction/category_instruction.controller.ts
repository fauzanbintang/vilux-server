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
import { CategoryInstructionService } from './category_instruction.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateCategoryInstructionDto,
  UpdateCategoryInstructionDto,
} from 'src/dto/request/category_instruction.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { CategoryInstructionDto } from 'src/dto/response/category_instruction.dto';

@ApiTags('category instruction')
@Controller('api/category_instruction')
export class CategoryInstructionController {
  constructor(
    private readonly categoryInstructionService: CategoryInstructionService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createCategoryInstructionDto: CreateCategoryInstructionDto,
  ): Promise<ResponseDto<CategoryInstructionDto>> {
    const categoryInstruction = await this.categoryInstructionService.create(
      createCategoryInstructionDto,
    );

    return { data: categoryInstruction };
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<CategoryInstructionDto[]>> {
    const categories = await this.categoryInstructionService.findAll();

    return { data: categories };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDto<CategoryInstructionDto>> {
    const categoryInstruction =
      await this.categoryInstructionService.findOne(id);

    return { data: categoryInstruction };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryInstructionDto: UpdateCategoryInstructionDto,
  ): Promise<ResponseDto<CategoryInstructionDto>> {
    const categoryInstruction = await this.categoryInstructionService.update(
      id,
      updateCategoryInstructionDto,
    );

    return { data: categoryInstruction };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.categoryInstructionService.remove(id);

    return { message: 'successfully delete a category instruction' };
  }
}

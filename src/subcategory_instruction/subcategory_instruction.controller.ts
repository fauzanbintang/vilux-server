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
import { SubcategoryInstructionService } from './subcategory_instruction.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateSubcategoryInstructionDto,
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
  async create(
    @Body() createSubcategoryInstructionDto: CreateSubcategoryInstructionDto,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const subcategoryInstruction =
      await this.subcategoryInstructionService.create(
        createSubcategoryInstructionDto,
      );

    return { data: subcategoryInstruction };
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<SubcategoryInstructionDto[]>> {
    const categories = await this.subcategoryInstructionService.findAll();

    return { data: categories };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const subcategoryInstruction =
      await this.subcategoryInstructionService.findOne(id);

    return { data: subcategoryInstruction };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateSubcategoryInstructionDto: UpdateSubcategoryInstructionDto,
  ): Promise<ResponseDto<SubcategoryInstructionDto>> {
    const subcategoryInstruction =
      await this.subcategoryInstructionService.update(
        id,
        updateSubcategoryInstructionDto,
      );

    return { data: subcategoryInstruction };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.subcategoryInstructionService.remove(id);

    return { message: 'successfully delete a category instruction' };
  }
}

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateCategoryInstructionDto,
  UpdateCategoryInstructionDto,
} from 'src/dto/request/category_instruction.dto';
import { CategoryInstructionDto } from 'src/dto/response/category_instruction.dto';

@Injectable()
export class CategoryInstructionService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createCategoryInstructionDto: CreateCategoryInstructionDto,
  ): Promise<CategoryInstructionDto> {
    this.logger.debug(
      `Create new category instruction ${JSON.stringify(createCategoryInstructionDto)}`,
    );

    const categoryInstruction =
      await this.prismaService.categoryInstruction.create({
        data: {
          name: createCategoryInstructionDto.name,
          file_id: createCategoryInstructionDto.file_id,
          category_id: createCategoryInstructionDto.category_id,
        },
      });

    return {
      name: categoryInstruction.name,
      file_id: categoryInstruction.file_id,
      category_id: categoryInstruction.category_id,
    };
  }

  async findAll(): Promise<CategoryInstructionDto[]> {
    this.logger.debug('Get all category instructions');

    const categoryInstructions =
      await this.prismaService.categoryInstruction.findMany();

    return categoryInstructions.map((categoryInstruction) => {
      return {
        name: categoryInstruction.name,
        file_id: categoryInstruction.file_id,
        category_id: categoryInstruction.category_id,
      };
    });
  }

  async findOne(id: string): Promise<CategoryInstructionDto> {
    const categoryInstruction =
      await this.prismaService.categoryInstruction.findUnique({
        where: { id },
      });

    if (!categoryInstruction) {
      throw new HttpException('category instruction not found', 404);
    }

    return {
      name: categoryInstruction.name,
      file_id: categoryInstruction.file_id,
      category_id: categoryInstruction.category_id,
    };
  }

  async update(
    id: string,
    updateCategoryInstructionDto: UpdateCategoryInstructionDto,
  ): Promise<CategoryInstructionDto> {
    const categoryInstruction =
      await this.prismaService.categoryInstruction.findUnique({
        where: { id },
      });

    if (!categoryInstruction) {
      throw new HttpException('category instruction not found', 404);
    }

    const updatedCategoryInstruction =
      await this.prismaService.categoryInstruction.update({
        where: { id },
        data: updateCategoryInstructionDto,
      });

    return {
      name: updatedCategoryInstruction.name,
      file_id: updatedCategoryInstruction.file_id,
      category_id: updatedCategoryInstruction.category_id,
    };
  }

  async remove(id: string) {
    const categoryInstruction =
      await this.prismaService.categoryInstruction.findUnique({
        where: { id },
      });

    if (!categoryInstruction) {
      throw new HttpException('category instruction not found', 404);
    }

    await this.prismaService.categoryInstruction.delete({
      where: { id },
    });
  }
}

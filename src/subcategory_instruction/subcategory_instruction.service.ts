import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateSubcategoryInstructionDto,
  UpdateSubcategoryInstructionDto,
} from 'src/dto/request/subcategory_instruction.dto';
import { SubcategoryInstructionDto } from 'src/dto/response/subcategory_instruction.dto';

@Injectable()
export class SubcategoryInstructionService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createSubcategoryInstructionDto: CreateSubcategoryInstructionDto,
  ): Promise<SubcategoryInstructionDto> {
    this.logger.debug(
      `Create new subcategory instruction ${JSON.stringify(createSubcategoryInstructionDto)}`,
    );

    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.create({
        data: {
          name: createSubcategoryInstructionDto.name,
          file_id: createSubcategoryInstructionDto.file_id,
          subcategory_id: createSubcategoryInstructionDto.subcategory_id,
        },
      });

    return {
      name: subcategoryInstruction.name,
      file_id: subcategoryInstruction.file_id,
      subcategory_id: subcategoryInstruction.subcategory_id,
    };
  }

  async findAll(): Promise<SubcategoryInstructionDto[]> {
    this.logger.debug('Get all subcategory instructions');

    const subcategoryInstructions =
      await this.prismaService.subcategoryInstruction.findMany();

    return subcategoryInstructions.map((subcategoryInstruction) => {
      return {
        name: subcategoryInstruction.name,
        file_id: subcategoryInstruction.file_id,
        subcategory_id: subcategoryInstruction.subcategory_id,
      };
    });
  }

  async findOne(id: string): Promise<SubcategoryInstructionDto> {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    return {
      name: subcategoryInstruction.name,
      file_id: subcategoryInstruction.file_id,
      subcategory_id: subcategoryInstruction.subcategory_id,
    };
  }

  async update(
    id: string,
    updateSubcategoryInstructionDto: UpdateSubcategoryInstructionDto,
  ): Promise<SubcategoryInstructionDto> {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    const updatedSubcategoryInstruction =
      await this.prismaService.subcategoryInstruction.update({
        where: { id },
        data: updateSubcategoryInstructionDto,
      });

    return {
      name: updatedSubcategoryInstruction.name,
      file_id: updatedSubcategoryInstruction.file_id,
      subcategory_id: updatedSubcategoryInstruction.subcategory_id,
    };
  }

  async remove(id: string) {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    await this.prismaService.subcategoryInstruction.delete({
      where: { id },
    });
  }
}

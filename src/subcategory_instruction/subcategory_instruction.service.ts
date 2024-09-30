import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateSubcategoryInstructionDto,
  SubcategoryInstructionsQuery,
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
          subcategory_id: createSubcategoryInstructionDto.subcategory_id,
          icon_id: createSubcategoryInstructionDto.icon_id,
          example_image_id: createSubcategoryInstructionDto.example_image_id,
        },
      });

    return subcategoryInstruction;
  }

  async findAll(
    query: SubcategoryInstructionsQuery,
  ): Promise<SubcategoryInstructionDto[]> {
    this.logger.debug('Get all subcategory instructions');

    const subcategoryInstructions =
      await this.prismaService.subcategoryInstruction.findMany({
        where: {
          subcategory_id: query.subcategory_id,
        },
        include: {
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          icon: {
            select: {
              id: true,
              path: true,
              file_name: true,
              url: true,
            },
          },
          example_image: {
            select: {
              id: true,
              path: true,
              file_name: true,
              url: true,
            },
          },
        },
      });

    return subcategoryInstructions;
  }

  async findOne(id: string): Promise<SubcategoryInstructionDto> {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
        include: {
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          icon: {
            select: {
              id: true,
              path: true,
              file_name: true,
              url: true,
            },
          },
          example_image: {
            select: {
              id: true,
              path: true,
              file_name: true,
              url: true,
            },
          },
        },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    return subcategoryInstruction;
  }

  async update(
    id: string,
    updateSubcategoryInstructionDto: UpdateSubcategoryInstructionDto,
  ): Promise<SubcategoryInstructionDto> {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    const updatedSubcategoryInstruction =
      await this.prismaService.subcategoryInstruction.update({
        where: { id },
        data: updateSubcategoryInstructionDto,
      });

    return updatedSubcategoryInstruction;
  }

  async remove(id: string) {
    const subcategoryInstruction =
      await this.prismaService.subcategoryInstruction.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });

    if (!subcategoryInstruction) {
      throw new HttpException('subcategory instruction not found', 404);
    }

    await this.prismaService.subcategoryInstruction.delete({
      where: { id },
    });
  }
}

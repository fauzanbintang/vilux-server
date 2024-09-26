import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  CreateSubcategoryDto,
  UpdateSubcategoryDto,
} from 'src/dto/request/subcategory.dto';
import { SubcategoryDto } from 'src/dto/response/subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<SubcategoryDto> {
    this.logger.debug(
      `Create new subcategory ${JSON.stringify(createSubcategoryDto)}`,
    );

    const subcategory = await this.prismaService.subcategory.create({
      data: {
        name: createSubcategoryDto.name,
        category_id: createSubcategoryDto.category_id,
        file_id: createSubcategoryDto.file_id,
      },
    });

    return subcategory;
  }

  async findAll(): Promise<SubcategoryDto[]> {
    this.logger.debug('Get all categories');

    const categories = await this.prismaService.subcategory.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            file: {
              select: {
                id: true,
                path: true,
                file_name: true,
                url: true,
              },
            },
          },
        },
        file: {
          select: {
            id: true,
            path: true,
            file_name: true,
            url: true,
          },
        },
      },
    });

    return categories;
  }

  async findOne(id: string): Promise<SubcategoryDto> {
    const subcategory = await this.prismaService.subcategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            file: {
              select: {
                id: true,
                path: true,
                file_name: true,
                url: true,
              },
            },
          },
        },
        file: {
          select: {
            id: true,
            path: true,
            file_name: true,
            url: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new HttpException('subcategory not found', 404);
    }

    return subcategory;
  }

  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<SubcategoryDto> {
    const subcategory = await this.prismaService.subcategory.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!subcategory) {
      throw new HttpException('subcategory not found', 404);
    }

    const updatedSubcategory = await this.prismaService.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });

    return updatedSubcategory;
  }

  async remove(id: string) {
    const subcategory = await this.prismaService.subcategory.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!subcategory) {
      throw new HttpException('subcategory not found', 404);
    }

    await this.prismaService.subcategory.delete({
      where: { id },
    });
  }
}

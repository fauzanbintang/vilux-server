import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from 'src/dto/request/category.dto';
import { CategoryDto } from 'src/dto/response/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    this.logger.debug(
      `Create new category ${JSON.stringify(createCategoryDto)}`,
    );

    const category = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        file_id: createCategoryDto.file_id,
      },
    });

    return {
      name: category.name,
      file_id: category.file_id,
    };
  }

  async findAll(): Promise<CategoryDto[]> {
    this.logger.debug('Get all categories');

    const categories = await this.prismaService.category.findMany();

    return categories.map((category) => {
      return { name: category.name, file_id: category.file_id };
    });
  }

  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new HttpException('category not found', 404);
    }

    return {
      name: category.name,
      file_id: category.file_id,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new HttpException('category not found', 404);
    }

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      name: updatedCategory.name,
      file_id: updatedCategory.file_id,
    };
  }

  async remove(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new HttpException('category not found', 404);
    }

    await this.prismaService.category.delete({
      where: { id },
    });
  }
}

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  BrandPaginationQuery,
  CreateBrandDto,
  UpdateBrandDto,
} from 'src/dto/request/brand.dto';
import { BrandDto } from 'src/dto/response/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandDto> {
    this.logger.debug(`Create new brand ${JSON.stringify(createBrandDto)}`);

    const brand = await this.prismaService.brand.create({
      data: {
        name: createBrandDto.name,
        file_id: createBrandDto.file_id,
      },
    });

    return brand;
  }

  async findAll(query: BrandPaginationQuery): Promise<any> {
    this.logger.debug(
      `Get paginated brand with query: ${JSON.stringify(query)}`,
    );

    let whereClause: any = {
      name: {}
    };
    
    if (query.search) {
      whereClause.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const count = await this.prismaService.brand.count({
      where: whereClause,
    });

    const brands = await this.prismaService.brand.findMany({
      skip: (+query.page - 1) * +query.limit,
      take: +query.limit,
      where: whereClause,
      include: {
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

    return {
      count,
      brands,
    };
  }

  async findOne(id: string): Promise<BrandDto> {
    this.logger.debug(`Get brand with id: ${id}`);

    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      include: {
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

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!brand) {
      throw new HttpException('brand not found', 404);
    }

    const updatedBrand = await this.prismaService.brand.update({
      where: { id },
      data: updateBrandDto,
    });

    return updatedBrand;
  }

  async remove(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!brand) {
      throw new HttpException('brand not found', 404);
    }

    await this.prismaService.brand.delete({
      where: { id },
    });
  }
}

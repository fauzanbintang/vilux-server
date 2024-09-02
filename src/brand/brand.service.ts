import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateBrandDto, UpdateBrandDto } from 'src/dto/request/brand.dto';
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
        fileId: createBrandDto.fileId,
      },
    });

    return {
      name: brand.name,
      fileId: brand.fileId,
    };
  }

  async findAll(): Promise<BrandDto[]> {
    this.logger.debug('Get all brands');

    const brands = await this.prismaService.brand.findMany();
    return brands.map((brand) => {
      return { name: brand.name, fileId: brand.fileId };
    });
  }

  async findOne(id: string): Promise<BrandDto> {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    return {
      name: brand.name,
      fileId: brand.fileId,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new HttpException('brand not found', 404);
    }

    const updatedBrand = await this.prismaService.brand.update({
      where: { id },
      data: updateBrandDto,
    });

    return {
      name: updatedBrand.name,
      fileId: updateBrandDto.fileId,
    };
  }

  async remove(id: string) {
    const brand = await this.prismaService.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new HttpException('brand not found', 404);
    }

    await this.prismaService.brand.delete({
      where: { id },
    });
  }
}

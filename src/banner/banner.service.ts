import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from 'src/dto/request/banner.dto';
import { BannerDto } from 'src/dto/response/banner.dto';

@Injectable()
export class BannerService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<BannerDto> {
    this.logger.debug(`Create new banner ${JSON.stringify(createBannerDto)}`);

    const banner = await this.prismaService.banner.create({
      data: {
        name: createBannerDto.name,
        link: createBannerDto.link,
        file_id: createBannerDto.file_id,
      },
    });

    return banner;
  }

  async findAll(): Promise<BannerDto[]> {
    this.logger.debug('Get all banners');

    const banners = await this.prismaService.banner.findMany({
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

    return banners;
  }

  async findOne(id: string): Promise<BannerDto> {
    this.logger.debug(`Get banner with id: ${id}`);

    const banner = await this.prismaService.banner.findUnique({
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

    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    const banner = await this.prismaService.banner.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!banner) {
      throw new HttpException('banner not found', 404);
    }

    const updatedBanner = await this.prismaService.banner.update({
      where: { id },
      data: updateBannerDto,
    });

    return updatedBanner;
  }

  async remove(id: string) {
    const banner = await this.prismaService.banner.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!banner) {
      throw new HttpException('banner not found', 404);
    }

    await this.prismaService.banner.delete({
      where: { id },
    });
  }
}

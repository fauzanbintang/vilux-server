import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from '../dto/request/service.dto';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ServiceDto } from 'src/dto/response/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<ServiceDto> {
    this.logger.debug(`Create new service ${JSON.stringify(createServiceDto)}`);

    const service = await this.prismaService.services.create({
      data: {
        name: createServiceDto.name,
        working_hours: createServiceDto.working_hours,
        normal_price: Number.parseInt(createServiceDto.normal_price.toString()),
        vip_price: Number.parseInt(createServiceDto.vip_price.toString()),
        file_id: createServiceDto.file_id,
      },
    });
    console.log(service, 'ini service');
    return {
      ...service,
      normal_price: service.normal_price.toString(),
      vip_price: service.vip_price.toString(),
    };
  }

  async findAll(): Promise<ServiceDto[]> {
    this.logger.debug('Get all services');

    const services = await this.prismaService.services.findMany({
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

    const servicesRes = services.map((e) => {
      return {
        ...e,
        normal_price: e.normal_price.toString(),
        vip_price: e.vip_price.toString(),
      };
    });

    return servicesRes;
  }

  async findOne(id: string): Promise<ServiceDto> {
    this.logger.debug(`Get service with id: ${id}`);

    const service = await this.prismaService.services.findUnique({
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

    return {
      ...service,
      normal_price: service.normal_price.toString(),
      vip_price: service.vip_price.toString(),
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.prismaService.services.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!service) {
      throw new HttpException('service not found', 404);
    }

    const updatedService = await this.prismaService.services.update({
      where: { id },
      data: updateServiceDto,
    });

    return {
      ...updatedService,
      normal_price: updatedService.normal_price.toString(),
      vip_price: updatedService.vip_price.toString(),
    };
  }

  async remove(id: string) {
    const service = await this.prismaService.services.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!service) {
      throw new HttpException('service not found', 404);
    }

    await this.prismaService.services.delete({
      where: { id },
    });
  }
}

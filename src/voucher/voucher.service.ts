import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { VoucherType } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
} from 'src/dto/request/voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createVoucherDto: CreateVoucherDto) {
    this.logger.debug(`Create voucher ${JSON.stringify(createVoucherDto)}`);

    const voucherType = VoucherType[createVoucherDto.voucher_type];
    if (!voucherType) {
      throw new HttpException('Invalid voucher type', 400);
    }

    const quotaUsage = Number(createVoucherDto.quota_usage);
    if (isNaN(quotaUsage)) {
      throw new HttpException('Invalid quota usage', 400);
    }

    const startedAt = new Date(createVoucherDto.started_at);
    const expiredAt = new Date(createVoucherDto.expired_at);

    if (isNaN(startedAt.getTime()) || isNaN(expiredAt.getTime())) {
      throw new HttpException('Invalid date format', 400);
    }

    if (startedAt < new Date() || expiredAt < startedAt) {
      throw new HttpException('Invalid expiration date', 400);
    }

    const activeStatus =
      createVoucherDto.active_status === 'false' ? false : true;

    const voucher = await this.prismaService.voucher.create({
      data: {
        name: createVoucherDto.name,
        code: createVoucherDto.code,
        voucher_type: voucherType,
        discount: createVoucherDto.discount,
        quota_usage: quotaUsage,
        started_at: startedAt,
        expired_at: expiredAt,
        active_status: activeStatus,
      },
    });

    return { data: voucher };
  }

  async findAll() {
    this.logger.debug('Get all vouchers');

    const vouchers = await this.prismaService.voucher.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        voucher_type: true,
        discount: true,
        quota_usage: true,
        started_at: true,
        expired_at: true,
        active_status: true,
      },
    });
    return { data: vouchers };
  }

  async findOne(id: string) {
    this.logger.debug(`Get voucher by id ${id}`);

    const voucher = await this.prismaService.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new HttpException('Voucher not found', 404);
    }

    return { data: voucher };
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto) {
    this.logger.debug(`Update voucher by id ${id}`);

    const voucher = await this.prismaService.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new HttpException('Voucher not found', 404);
    }

    const voucherType = VoucherType[updateVoucherDto.voucher_type];
    if (!voucherType) {
      throw new HttpException('Invalid voucher type', 400);
    }

    const quotaUsage = Number(updateVoucherDto.quota_usage);
    if (isNaN(quotaUsage)) {
      throw new HttpException('Invalid quota usage', 400);
    }

    const startedAt = new Date(updateVoucherDto.started_at);
    const expiredAt = new Date(updateVoucherDto.expired_at);

    if (isNaN(startedAt.getTime()) || isNaN(expiredAt.getTime())) {
      throw new HttpException('Invalid date format', 400);
    }

    if (startedAt < new Date() || expiredAt < startedAt) {
      throw new HttpException('Invalid expiration date', 400);
    }

    const activeStatus =
      updateVoucherDto.active_status === 'false' ? false : true;

    const updatedVoucher = await this.prismaService.voucher.update({
      where: { id },
      data: {
        name: updateVoucherDto.name,
        code: updateVoucherDto.code,
        voucher_type: voucherType,
        discount: updateVoucherDto.discount,
        quota_usage: quotaUsage,
        started_at: startedAt,
        expired_at: expiredAt,
        active_status: activeStatus,
      },
    });

    return { data: updatedVoucher };
  }

  async remove(id: string) {
    this.logger.debug(`Remove voucher by id ${id}`);

    const voucher = await this.prismaService.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new HttpException('Voucher not found', 404);
    }

    await this.prismaService.voucher.delete({
      where: { id },
    });
    return { data: { message: `Voucher ${id} deleted` } };
  }
}

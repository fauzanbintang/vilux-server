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

    const voucher = await this.prismaService.voucher.create({
      data: {
        name: createVoucherDto.name,
        code: createVoucherDto.code,
        voucher_type: voucherType,
        discount: createVoucherDto.discount,
        quota_usage: quotaUsage,
        started_at: startedAt,
        expired_at: expiredAt,
        active_status: createVoucherDto.active_status,
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

    const { voucher_type, quota_usage, started_at, expired_at, active_status } =
      updateVoucherDto;

    if (voucher_type) {
      const validVoucherType = VoucherType[voucher_type];
      if (!validVoucherType) {
        throw new HttpException('Invalid voucher type', 400);
      }
      updateVoucherDto.voucher_type = validVoucherType;
    }

    if (quota_usage) {
      const parsedQuotaUsage = Number(quota_usage);
      if (isNaN(parsedQuotaUsage)) {
        throw new HttpException('Invalid quota usage', 400);
      }
      updateVoucherDto.quota_usage = parsedQuotaUsage;
    }

    if (started_at || expired_at) {
      const startDate = started_at ? new Date(started_at) : voucher.started_at;
      const expireDate = expired_at ? new Date(expired_at) : voucher.expired_at;

      if (startDate && isNaN(startDate.getTime())) {
        throw new HttpException('Invalid start date format', 400);
      }

      if (expireDate && isNaN(expireDate.getTime())) {
        throw new HttpException('Invalid expiration date format', 400);
      }

      if (
        startDate &&
        expireDate &&
        (startDate < new Date() || expireDate <= startDate)
      ) {
        throw new HttpException('Invalid expiration date', 400);
      }

      updateVoucherDto.started_at = startDate;
      updateVoucherDto.expired_at = expireDate;
    }

    // if (active_status) {
    //   updateVoucherDto.active_status = JSON.parse(active_status);
    // }

    const updatedVoucher = await this.prismaService.voucher.update({
      where: { id },
      data: updateVoucherDto,
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
  }
}

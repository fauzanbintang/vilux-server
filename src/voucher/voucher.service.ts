import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { VoucherType } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  ActiveFinished,
  CreateVoucherPromotionDto,
  CreateVoucherReferralDto,
  GetVouchersnQuery,
  UpdateVoucherPromotionDto,
  UpdateVoucherReferralDto,
} from 'src/dto/request/voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    createVoucherDto: CreateVoucherReferralDto | CreateVoucherPromotionDto,
    voucherType: VoucherType,
  ) {
    this.logger.debug(`Create voucher ${JSON.stringify(createVoucherDto)}`);

    const startedAt = new Date(createVoucherDto.started_at ?? Date.now());
    const expiredAt = new Date(createVoucherDto.expired_at);
    if (expiredAt < startedAt) {
      throw new HttpException('Invalid expiration date', 400);
    }

    let user;
    if ('email' in createVoucherDto) {
      user = await this.prismaService.user.findUnique({
        where: { email: createVoucherDto.email },
      });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      delete createVoucherDto.email;
    }

    const voucher = await this.prismaService.voucher.create({
      data: {
        ...createVoucherDto,
        voucher_type: voucherType,
        user_id: user?.id ?? null,
      },
    });

    if (user) {
      await this.prismaService.voucherUsage.create({
        data: {
          voucher_id: voucher.id,
          user_id: user.id,
        },
      });
    }

    return voucher;
  }

  async findAll(query: GetVouchersnQuery) {
    this.logger.debug('Get all vouchers');

    const now = new Date(Date.now());
    let voucherQuery: { [key: string]: any } = {
      voucher_type: {
        in: query.voucher_type,
      },
    };
    if (query.active_finished.includes(ActiveFinished.active)) {
      voucherQuery.started_at = {
        lte: now,
      };
      voucherQuery.expired_at = {
        gt: now,
      };
    }
    if (query.active_finished.includes(ActiveFinished.finished)) {
      if (voucherQuery.started_at) {
        voucherQuery.started_at = {};
        voucherQuery.expired_at = {};
      } else {
        voucherQuery.expired_at = {
          lte: now,
        };
      }
    }

    const vouchers = await this.prismaService.voucher.findMany({
      select: {
        id: true,
        name: true,
        voucher_type: true,
        started_at: true,
        expired_at: true,
        discount: true,
        code: true,
        user_id: true,
      },
      where: voucherQuery,
    });

    return vouchers;
  }

  async findOne(id: string) {
    this.logger.debug(`Get voucher by id ${id}`);

    const voucher = await this.prismaService.voucher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    if (!voucher) {
      throw new HttpException('Voucher not found', 404);
    }

    return voucher;
  }

  async update(
    id: string,
    updateVoucherDto: UpdateVoucherPromotionDto | UpdateVoucherReferralDto,
  ) {
    this.logger.debug(`Update voucher by id ${id}`);

    const voucher = await this.prismaService.voucher.findUnique({
      where: { id },
      select: {
        id: true,
        started_at: true,
        expired_at: true,
      },
    });
    if (!voucher) {
      throw new HttpException('Voucher not found', 404);
    }

    if (updateVoucherDto.started_at || updateVoucherDto.expired_at) {
      const startDate = updateVoucherDto.started_at
        ? new Date(updateVoucherDto.started_at)
        : voucher.started_at;
      const expireDate = updateVoucherDto.expired_at
        ? new Date(updateVoucherDto.expired_at)
        : voucher.expired_at;

      if (startDate && isNaN(startDate.getTime())) {
        throw new HttpException('Invalid start date format', 400);
      }

      if (expireDate && isNaN(expireDate.getTime())) {
        throw new HttpException('Invalid expiration date format', 400);
      }

      if (startDate && expireDate && expireDate <= startDate) {
        throw new HttpException('Invalid expiration date', 400);
      }

      updateVoucherDto.started_at = startDate;
      updateVoucherDto.expired_at = expireDate;
    }

    const updatedVoucher = await this.prismaService.voucher.update({
      where: { id },
      data: updateVoucherDto,
    });

    return updatedVoucher;
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

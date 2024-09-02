import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    this.logger.debug(`Create payment ${JSON.stringify(createPaymentDto)}`);

    const payment = await this.prismaService.payment.create({
      data: {
        method: createPaymentDto.method,
        amount: createPaymentDto.amount,
        status: PaymentStatus[createPaymentDto.status],
        status_log: createPaymentDto.status_log,
        external_id: createPaymentDto.external_id,
        service_fee: createPaymentDto.service_fee,
        client_amount: createPaymentDto.client_amount,
      },
    });
    return { data: payment };
  }

  async findAll() {
    this.logger.debug('Get all payments');

    const payments = await this.prismaService.payment.findMany();
    return { data: payments };
  }

  async findOne(id: string) {
    this.logger.debug(`Get payment by id ${id}`);

    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return { data: payment };
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    this.logger.debug(`Update payment by id ${id}`);

    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    const updatedPayment = await this.prismaService.payment.update({
      where: { id },
      data: {
        method: updatePaymentDto.method,
        amount: updatePaymentDto.amount,
        status: PaymentStatus[updatePaymentDto.status],
        status_log: updatePaymentDto.status_log,
        external_id: updatePaymentDto.external_id,
        service_fee: updatePaymentDto.service_fee,
        client_amount: updatePaymentDto.client_amount,
      },
    });
    return { data: updatedPayment };
  }

  async remove(id: string) {
    this.logger.debug(`Delete payment by id ${id}`);

    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    await this.prismaService.payment.delete({
      where: { id },
    });

    return { data: { message: `Payment ${id} deleted` } };
  }
}

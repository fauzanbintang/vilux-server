import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async payment() {
    // this.logger.debug(`Create payment ${JSON.stringify(createPaymentDto)}`);

    const secret = this.configService.get('MIDTRANS_SERVER_KEY');
    const encoded = Buffer.from(secret).toString('base64');

    /**
     * bank_transfer: bca, bni, bri, cimb
     * echannel: mandiri
     * permata: permata
     * gopay: gopay
     *
     */
    // Data transaksi dengan bank transfer BCA
    let data = {
      // payment_type: 'qris', // Menentukan metode pembayaran
      // echannel: {
      //   bill_info1: 'Payment:',
      //   bill_info2: 'Online purchase',
      // },
      // bank_transfer: {
      //   bank: 'bni', // Menentukan bank BCA untuk virtual account
      // },
      item_details: [
        {
          id: 'pil-001',
          name: 'Pillow',
          price: 10000,
          quantity: 1,
          brand: 'Midtrans',
          category: 'Furniture',
          merchant_name: 'PT. Midtrans',
        },
      ],
      transaction_details: {
        order_id: Date.now(), // Menggunakan timestamp untuk order_id unik
        gross_amount: 10000, // Jumlah total transaksi
      },
      usage_limit: 1,
      expiry: {
        start_time: '2024-09-04 10:00 +0700',
        duration: 20,
        unit: 'days',
      },
    };

    try {
      const response = await fetch(
        `${this.configService.get('MIDTRANS_SANDBOX')}/v1/payment-links`, // Menggunakan endpoint 'charge' Midtrans
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Basic ${encoded}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text(); // Ini akan membantu kita melihat pesan error dari Midtrans
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const paymentResponse = await response.json();
      return paymentResponse; // Mengembalikan respons dari Midtrans
    } catch (error) {
      console.error('Payment request failed:', error);
      throw error;
    }
  }

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

    const payments = await this.prismaService.payment.findMany({
      select: {
        id: true,
        method: true,
        amount: true,
        status: true,
        status_log: true,
        external_id: true,
        service_fee: true,
        client_amount: true,
      },
    });
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
      data: updatePaymentDto,
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
  }
}

import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';
const midtransClient = require('midtrans-client');

@Injectable()
export class PaymentService {
  private readonly apiClient;
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    // Inisialisasi Snap API Client di constructor
    this.apiClient = new midtransClient.Snap({
      isProduction: false, // Sesuaikan dengan environment
      serverKey: this.configService.get('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.get('MIDTRANS_CLIENT_KEY'),
    });
  }

  async create(createPaymentDto: CreatePaymentDto) {
    this.logger.debug(`Create payment ${JSON.stringify(createPaymentDto)}`);

    const secret = this.configService.get('MIDTRANS_SERVER_KEY');
    const encoded = Buffer.from(secret).toString('base64');

    let data = {
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: createPaymentDto.client_amount,
      },
      usage_limit: 1,
      enabled_payments: [
        'bca_va',
        'bri_va',
        'bni_va',
        'permata_va',
        'gopay',
        'dana',
        'echannel',
      ],
    };

    const midtrans = await fetch(
      `${this.configService.get('MIDTRANS_SANDBOX')}/v1/payment-links`,
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

    if (!midtrans.ok) {
      const errorMessage = await midtrans.text();
      throw new Error(`Error ${midtrans.status}: ${errorMessage}`);
    }

    const response = await midtrans.json();

    const payment = await this.prismaService.payment.create({
      data: {
        method: response,
        amount: createPaymentDto.amount,
        status: PaymentStatus.pending,
        status_log: { success: null, failed: null, pending: Date.now() },
        external_id: response.order_id,
        service_fee: createPaymentDto.service_fee,
        client_amount: createPaymentDto.client_amount,
      },
    });
    return payment
  }

  async handleNotification(notificationJson: any) {
    const paymentGatewayFees = {
      bca_va: '1000',
      bri_va: '2000',
      bni_va: '3000',
      mandiri_va: '4000',
      permata_va: '5000',
      gopay: '6000',
      dana: '7000',
    };

    try {
      const statusResponse =
        await this.apiClient.transaction.notification(notificationJson);

      const orderId = statusResponse.order_id.split('-').slice(0, -1).join('-');
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      this.logger.debug(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`,
      );

      const payment = await this.prismaService.payment.findUnique({
        where: { external_id: orderId },
      });

      if (!payment) {
        throw new HttpException('Payment not found', 404);
      }

      let newStatus: PaymentStatus;

      if (transactionStatus === 'settlement') {
        newStatus = PaymentStatus.success;
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'deny' ||
        transactionStatus === 'expire'
      ) {
        newStatus = PaymentStatus.failed;
      } else if (transactionStatus === 'pending') {
        newStatus = PaymentStatus.pending;
      } else {
        throw new HttpException('Invalid transaction status', 400);
      }

      let serviceFee: string;
      if (statusResponse.payment_type === 'echannel') {
        serviceFee = paymentGatewayFees['mandiri_va'];
      } else if (statusResponse.permata_va_number) {
        serviceFee = paymentGatewayFees['permata_va'];
      } else if (statusResponse.va_numbers[0].bank === 'bca') {
        serviceFee = paymentGatewayFees['bca_va'];
      } else if (statusResponse.va_numbers[0].bank === 'bni') {
        serviceFee = paymentGatewayFees['bni_va'];
      } else if (statusResponse.va_numbers[0].bank === 'bri') {
        serviceFee = paymentGatewayFees['bri_va'];
      } else if (statusResponse.acquirer) {
        serviceFee = paymentGatewayFees['gopay'];
      } else {
        serviceFee = paymentGatewayFees['dana'];
      }

      await this.prismaService.payment.update({
        where: { external_id: orderId },
        data: {
          status: newStatus,
          status_log: {
            success:
              newStatus === PaymentStatus.success
                ? Date.now()
                : payment.status_log['success'],
            failed:
              newStatus === PaymentStatus.failed
                ? Date.now()
                : payment.status_log['failed'],
            pending:
              newStatus === PaymentStatus.pending
                ? Date.now()
                : payment.status_log['pending'],
          },
          service_fee: serviceFee,
        },
      });

      return { status: 'success' };
    } catch (error) {
      this.logger.error(`Error processing notification: ${error.message}`);
      throw new Error('Failed to process notification');
    }
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
    return payments
  }

  async findOne(id: string) {
    this.logger.debug(`Get payment by id ${id}`);

    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return payment
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
    return updatedPayment
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

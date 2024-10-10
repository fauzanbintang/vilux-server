import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LegitCheckStatus, PaymentStatus, Role } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';
import { UserDto } from 'src/dto/response/user.dto';
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

  async create(createPaymentDto: CreatePaymentDto, clientInfo: UserDto, orderId: string) {
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
        'qris',
        'echannel',
      ],
      customer_details: {
        first_name: clientInfo.full_name,
        email: clientInfo.email,
        phone: clientInfo.phone_number ? clientInfo.phone_number : '0123456789',
      },
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

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        voucher: true,
      }
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    if (Number(order.original_amount) != Number(createPaymentDto.amount)) {
      throw new HttpException('Invalid amount', 400);
    }

    let clientAmount = Number(order.original_amount);

    if (order.voucher?.discount) {
      clientAmount -= clientAmount * (order.voucher.discount / 100);
    }

    if (Number(createPaymentDto.client_amount) != clientAmount) {
      throw new HttpException('Invalid client_amount', 400);
    }

    const payment = await this.prismaService.payment.create({
      data: {
        service_fee: '0',
        method: response,
        amount: createPaymentDto.amount,
        status: PaymentStatus.pending,
        status_log: { success: null, failed: null, pending: Date.now() },
        external_id: response.order_id,
        client_amount: createPaymentDto.client_amount,
      },
    });

    if (payment) {
      await this.prismaService.order.update({
        where: { id: orderId },
        data: {
          payment_id: payment.id,
        },
      });
    }

    return payment
  }

  async handleNotification(notificationJson: any) {
    const paymentGatewayFees = {
      virtualAccount: 4000,
      gopay: 0.02,
      qris: 0.007,
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
        include: { order: true },
      });

      if (!payment) {
        throw new HttpException('Payment not found', 404);
      }

      let newStatus: PaymentStatus;

      if (transactionStatus === 'settlement') {
        newStatus = PaymentStatus.success;
        await this.prismaService.legitChecks.update({
          where: { id: payment.order.legit_check_id },
          data: { check_status: LegitCheckStatus.data_validation },
        })
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

      let paymentMethod = Object.assign({}, payment.method);
      let serviceFee: any;
      if (statusResponse.payment_type === 'echannel' || statusResponse.permata_va_number || statusResponse.va_numbers[0].bank) {
        if (statusResponse.payment_type === 'echannel') {
          paymentMethod['biller_code'] = statusResponse.biller_code
          paymentMethod['bill_key'] = statusResponse.bill_key
        } else {
          paymentMethod['va_number'] = statusResponse.permata_va_number || statusResponse.va_numbers[0].va_number
        }
        paymentMethod['bank'] = statusResponse.payment_type == 'echannel' ? 'mandiri' : statusResponse.permata_va_number ? 'permata' : statusResponse.va_numbers[0].bank
        paymentMethod['expiry_time'] = statusResponse.expiry_time
        paymentMethod['payment_type'] = "bank_transfer"
        serviceFee = paymentGatewayFees.virtualAccount;
      } else if (statusResponse.payment_type === 'gopay') {
        serviceFee = Number(payment.client_amount) * paymentGatewayFees.gopay;
      } else if (statusResponse.payment_type === 'qris') {
        serviceFee = Number(payment.client_amount) * paymentGatewayFees.qris;
      } else {
        throw new HttpException('Invalid payment type', 400);
      }

      await this.prismaService.payment.update({
        where: { external_id: orderId },
        data: {
          external_id: statusResponse.order_id,
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
          service_fee: JSON.stringify(serviceFee),
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

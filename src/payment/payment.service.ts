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
import { LedgerConst } from 'src/assets/constants';
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

  async create(
    createPaymentDto: CreatePaymentDto,
    clientInfo: UserDto,
    orderId: string,
  ) {
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
      },
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

    return payment;
  }

  async handleNotification(notificationJson: any) {
    this.logger.debug(
      `Notification received: ${JSON.stringify(notificationJson)}`,
    );

    const paymentGatewayFees = {
      virtualAccount: 4000,
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
        include: {
          order: {
            include: { voucher: true },
          },
        },
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
        });
        await this.createLedger(
          BigInt(payment.client_amount),
          payment.order.id,
          payment.id,
          'payments',
          BigInt(payment.order?.voucher?.discount || 0),
          BigInt(payment.service_fee),
        );
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
      if (
        statusResponse.payment_type === 'echannel' ||
        statusResponse.permata_va_number ||
        (statusResponse.va_numbers && statusResponse.va_numbers[0].bank)
      ) {
        if (statusResponse.payment_type === 'echannel') {
          paymentMethod['biller_code'] = statusResponse.biller_code;
          paymentMethod['bill_key'] = statusResponse.bill_key;
        } else {
          paymentMethod['va_number'] =
            statusResponse.permata_va_number ||
            statusResponse.va_numbers[0].va_number;
        }
        paymentMethod['bank'] =
          statusResponse.payment_type == 'echannel'
            ? 'mandiri'
            : statusResponse.permata_va_number
              ? 'permata'
              : statusResponse.va_numbers[0].bank;
        paymentMethod['payment_type'] = 'bank_transfer';
        serviceFee = paymentGatewayFees.virtualAccount;
      } else if (statusResponse.payment_type === 'qris') {
        serviceFee = Number(payment.client_amount) * paymentGatewayFees.qris;
        paymentMethod['payment_type'] = 'qris';
        paymentMethod['platform'] = statusResponse.issuer;
      } else {
        throw new HttpException('Invalid payment type', 400);
      }
      paymentMethod['expiry_time'] = statusResponse.expiry_time;
      paymentMethod['order_id'] = statusResponse.order_id;

      await this.prismaService.payment.update({
        where: { external_id: orderId },
        data: {
          status: newStatus,
          method: paymentMethod,
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
    return payments;
  }

  async findOne(id: string) {
    this.logger.debug(`Get payment by id ${id}`);

    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new HttpException('Payment not found', 404);
    }

    return payment;
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
    return updatedPayment;
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

  async createLedger(
    serviceAmount: bigint,
    transactionId: string,
    referenceId: string,
    referenceType: string,
    voucherAmount: bigint,
    PGFee: bigint,
  ) {
    class CreateLedgerRes {
      id: string;
      created_at: Date;
      description: string;
      amount: bigint;
      is_credit: boolean;
      transaction_id: string;
      transaction_type: string;
      sum_from: bigint;
      sum_to: bigint;
      reference_id: string;
      referece_type: string;
    }
    try {
      await this.prismaService.$transaction(async (tx) => {
        // + service fee -> order
        let viluxMargin: CreateLedgerRes;
        let viluxOrder: CreateLedgerRes = await tx.ledger.create({
          data: {
            description: LedgerConst.LegitCheckService,
            amount: serviceAmount, // minus voucher. ex: service = 100, voucher = 25, then amount will be 75
            is_credit: true,
            transaction_id: transactionId, // order id
            transaction_type: LedgerConst.Order, // orders
            sum_from: 0,
            sum_to: serviceAmount,
            reference_id: referenceId, // payment id
            referece_type: referenceType, // payments
          },
        });
        if (voucherAmount && voucherAmount > 0) {
          // + vlx voucher discount -> order
          viluxOrder = await tx.ledger.create({
            data: {
              description: LedgerConst.Voucher,
              amount: voucherAmount,
              is_credit: true,
              transaction_id: transactionId, // order id
              transaction_type: LedgerConst.Order, // orders
              sum_from: viluxOrder.sum_to,
              sum_to: viluxOrder.sum_to + voucherAmount,
              reference_id: referenceId, // payment id
              referece_type: referenceType, // payments
            },
          });
          // - vlx voucher discount -> margin
          viluxMargin = await tx.ledger.create({
            data: {
              description: LedgerConst.Voucher,
              amount: voucherAmount,
              is_credit: false,
              transaction_id: transactionId, // order id
              transaction_type: LedgerConst.Margin, // margins
              sum_from: 0,
              sum_to: -voucherAmount,
              reference_id: referenceId, // payment id
              referece_type: referenceType, // payments
            },
          });
        }
        // - payment gateway fee -> margin
        viluxMargin = await tx.ledger.create({
          data: {
            description: LedgerConst.PaymentGatewayFee,
            amount: PGFee,
            is_credit: false,
            transaction_id: transactionId, // order id
            transaction_type: LedgerConst.Margin,
            sum_from: viluxMargin?.sum_to || 0,
            sum_to: (viluxMargin?.sum_to || BigInt(0)) - PGFee,
            reference_id: referenceId, // payment id
            referece_type: referenceType, // payments
          },
        });
        // - vlx margin -> order
        let orderAmount = viluxOrder.sum_to;
        viluxOrder = await tx.ledger.create({
          data: {
            description: LedgerConst.ViluxMargin,
            amount: viluxOrder.sum_to,
            is_credit: false,
            transaction_id: transactionId, // order id
            transaction_type: LedgerConst.Order,
            sum_from: viluxOrder.sum_to,
            sum_to: viluxOrder.sum_to - viluxOrder.sum_to,
            reference_id: referenceId, // payment id
            referece_type: referenceType, // payments
          },
        });
        // + vlx margin -> margin
        viluxMargin = await tx.ledger.create({
          data: {
            description: LedgerConst.ViluxMargin,
            amount: orderAmount,
            is_credit: true,
            transaction_id: transactionId, // order id
            transaction_type: LedgerConst.Margin,
            sum_from: viluxMargin.sum_to,
            sum_to: viluxMargin.sum_to + orderAmount,
            reference_id: referenceId, // payment id
            referece_type: referenceType, // payments
          },
        });
      });
    } catch (err) {
      console.log(err, "EROOOOOR");

      if (err instanceof HttpException) {
        throw new HttpException(
          JSON.stringify(err.message),
          err.getStatus(),
        );
      } else {
        throw new HttpException(
          'Internal Server Error',
          500,
        );
      }
    }
  }
}

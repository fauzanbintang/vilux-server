import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';
import { PaymentDto } from 'src/dto/response/payment.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('payment')
@Controller('api/payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Post('/midtrans')
  @HttpCode(201)
  async payment() {
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

  @Get('/midtrans')
  @HttpCode(200)
  async fetchPaymentMethods() {
    console.log('Fetching payment methods...');

    const secret = this.configService.get('MIDTRANS_SERVER_KEY');
    const encoded = Buffer.from(secret).toString('base64');

    // Data untuk transaksi dasar
    let data = {
      transaction_details: {
        order_id: Date.now(), // Menggunakan timestamp untuk order_id unik
        gross_amount: 10000, // Jumlah total transaksi
      },
      item_details: [
        {
          id: 1,
          price: 10000,
          quantity: 1,
          name: 'Pulsa 30.000',
        },
      ],
      customer_details: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '08123456789',
      },
      enabled_payments: [], // Kosongkan jika ingin mendapatkan semua metode pembayaran
    };

    try {
      const response = await fetch(
        `${this.configService.get('MIDTRANS_SANDBOX')}/snap/v1/transactions`, // Snap endpoint for transactions
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
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const paymentMethods = await response.json();

      // Returning all enabled payment methods from the response
      return paymentMethods;
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ResponseDto<PaymentDto>> {
    return await this.paymentService.create(createPaymentDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<PaymentDto[]>> {
    return await this.paymentService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<PaymentDto>> {
    return await this.paymentService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<ResponseDto<PaymentDto>> {
    return await this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.paymentService.remove(id);
    return { message: 'successfully delete a payment' };
  }
}

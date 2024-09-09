import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';
import { PaymentDto } from 'src/dto/response/payment.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

@ApiTags('payment')
@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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

  @Put('/success/:id')
  @HttpCode(200)
  async paymentSuccess(
    @Param('id') id: string,
  ): Promise<ResponseDto<PaymentDto>> {
    const payment = await this.paymentService.findOne(id);

    if (payment.data.status === PaymentStatus.failed) {
      throw new HttpException('Payment already failed', 400);
    }

    const updatePaymentDto: UpdatePaymentDto = {
      status: PaymentStatus.success,
      status_log: {
        success: Date.now(),
        failed: null,
        pending: payment.data.status_log['pending'],
      },
    };
    return await this.paymentService.update(id, updatePaymentDto);
  }

  @Put('/fail/:id')
  @HttpCode(200)
  async paymentFail(@Param('id') id: string): Promise<ResponseDto<PaymentDto>> {
    const payment = await this.paymentService.findOne(id);

    if (payment.data.status === PaymentStatus.success) {
      throw new HttpException('Payment already success', 400);
    }

    const updatePaymentDto: UpdatePaymentDto = {
      status: PaymentStatus.failed,
      status_log: {
        success: null,
        failed: Date.now(),
        pending: payment.data.status_log['pending'],
      },
    };
    return await this.paymentService.update(id, updatePaymentDto);
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

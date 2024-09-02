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

@Controller('/api/payments')
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
    return {message: "successfully delete a payment"}
  }
}

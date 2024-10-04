import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from 'src/dto/request/payment.dto';
import { PaymentDto } from 'src/dto/response/payment.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payment')
@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({
    status: 201,
    description: 'Created payment',
    schema: {
      example: {
        message: 'Successfully created payment',
        data: {
          id: 'string',
          method: 'string',
          amount: 0,
          status: 'string',
          status_log: {
            success: 'string',
            failed: 'string',
            pending: 'string',
          },
          external_id: 'string',
          service_fee: 0,
          client_amount: 0,
        },
        errors: null
      }
    }
  })
  async create(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ResponseDto<PaymentDto>> {
    const payment = await this.paymentService.create(createPaymentDto, req.user);

    return {
      message: 'Successfully created payment',
      data: payment,
      errors: null
    }
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({
    status: 200,
    description: 'Get all payments',
    schema: {
      example: {
        message: 'Successfully get all payments',
        data: [
          {
            id: 'string',
            method: 'string',
            amount: 0,
            status: 'string',
            status_log: {
              success: 'string',
              failed: 'string',
              pending: 'string',
            },
            external_id: 'string',
            service_fee: 0,
            client_amount: 0,
          },
        ],
        errors: null
      }
    }
  })
  async findAll(): Promise<ResponseDto<PaymentDto[]>> {
    const payments = await this.paymentService.findAll();

    return {
      message: 'Successfully get all payments',
      data: payments,
      errors: null
    }
  }

  @Post('/notification')
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle payment notification from midtrans' })
  @ApiResponse({
    status: 200,
    description: 'Handle payment notification from midtrans',
    schema: {
      example: {
        status: 'string'
      }
    }
  })
  async handleNotification(
    @Body() notification: any,
  ): Promise<{ status: string }> {
    return await this.paymentService.handleNotification(notification);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get payment detail' })
  @ApiResponse({
    status: 200,
    description: 'Get payment detail',
    schema: {
      example: {
        message: 'Successfully get payment detail',
        data: {
          id: 'string',
          method: 'string',
          amount: 0,
          status: 'string',
          status_log: {
            success: 'string',
            failed: 'string',
            pending: 'string',
          },
          external_id: 'string',
          service_fee: 0,
          client_amount: 0,
        },
        errors: null
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<ResponseDto<PaymentDto>> {
    const payment = await this.paymentService.findOne(id);

    return {
      message: 'Successfully get payment detail',
      data: payment,
      errors: null
    }
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({
    status: 200,
    description: 'Update payment',
    schema: {
      example: {
        message: 'Successfully update payment',
        data: {
          id: 'string',
          method: 'string',
          amount: 0,
          status: 'string',
          status_log: {
            success: 'string',
            failed: 'string',
            pending: 'string',
          },
          external_id: 'string',
          service_fee: 0,
          client_amount: 0,
        },
        errors: null
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<ResponseDto<PaymentDto>> {
    const payment = await this.paymentService.update(id, updatePaymentDto);

    return {
      message: 'Successfully update payment',
      data: payment,
      errors: null
    }
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({
    status: 200,
    description: 'Delete payment',
    schema: {
      example: {
        message: 'Successfully delete a payment',
        data: null,
        errors: null
      }
    }
  })
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.paymentService.remove(id);
    return { message: 'Successfully delete a payment', data: null, errors: null };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/request/order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { OrderDto } from 'src/dto/response/order.dto';

@ApiTags('order')
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    schema: {
      example: {
        message: 'The order has been successfully created.',
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          code: 'OD12345',
          legit_check_id: '00000000-0000-0000-0000-000000000000',
          service_id: '00000000-0000-0000-0000-000000000000',
          voucher_id: '00000000-0000-0000-0000-000000000000',
          payment_id: null,
          original_amount: '10000',
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async create(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto<OrderDto>> {
    const data = await this.orderService.create(req.user, createOrderDto);

    return {
      message: 'The order has been successfully created.',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<OrderDto[]>> {
    let data = await this.orderService.findAll();

    return {
      message: 'Successfully get all orders',
      data,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<OrderDto>> {
    let data = await this.orderService.findOne(id);

    return {
      message: 'Successfully get an order',
      data,
      errors: null,
    };
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ResponseDto<OrderDto>> {
    let data = await this.orderService.update(id, updateOrderDto);

    return {
      message: 'Successfully update an order',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.orderService.remove(id);

    return {
      message: 'Successfully delete an order',
      data: null,
      errors: null,
    };
  }
}

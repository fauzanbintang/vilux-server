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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { OrderDto } from 'src/dto/response/order.dto';

@ApiTags('order')
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    schema: {
      example: {
        message: 'The order has been successfully created.',
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          code: 'OD12345',
          client_info: { email: 'test@mail.com', full_name: 'test test' },
          payment_id: null,
          legit_check_id: '00000000-0000-0000-0000-000000000000',
          voucher_id: '00000000-0000-0000-0000-000000000000',
          original_amount: '10000',
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation errors.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
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
    return await this.orderService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<OrderDto>> {
    return await this.orderService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<ResponseDto<OrderDto>> {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.orderService.remove(id);
    return { message: 'successfully delete an order' };
  }
}

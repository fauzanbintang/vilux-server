import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/request/order.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { OrderDto } from 'src/dto/response/order.dto';

@ApiTags('order')
@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto<OrderDto>> {
    return await this.orderService.create(createOrderDto);
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

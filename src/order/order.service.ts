import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/request/order.dto';
import { generateCode } from 'src/helpers/order_code_generator';
import { UserDto } from 'src/dto/response/user.dto';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async create(clientInfo: UserDto, createOrderDto: CreateOrderDto) {
    this.logger.debug(`Create order ${JSON.stringify(createOrderDto)}`);

    const service = await this.prismaService.services.findUnique({
      where: { id: createOrderDto.service_id },
    });

    const order = await this.prismaService.order.create({
      data: {
        code: generateCode('OD'),
        legit_check_id: createOrderDto.legit_check_id,
        original_amount: service.price,
        voucher_id: createOrderDto.voucher_id,
      },
    });

    return order;
  }

  async findAll() {
    this.logger.debug('Get all orders');

    const orders = await this.prismaService.order.findMany({
      select: {
        id: true,
        code: true,
        payment_id: true,
        legit_check_id: true,
        voucher_id: true,
        original_amount: true,
      },
    });
    return { data: orders };
  }

  async findOne(id: string) {
    this.logger.debug(`Get order by id ${id}`);

    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    return { data: order };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    this.logger.debug(`Update order ${id} ${JSON.stringify(updateOrderDto)}`);

    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    const updatedOrder = await this.prismaService.order.update({
      where: { id },
      data: updateOrderDto,
    });
    return { data: updatedOrder };
  }

  async remove(id: string) {
    this.logger.debug(`Remove order ${id}`);

    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    await this.prismaService.order.delete({ where: { id } });
  }
}

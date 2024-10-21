import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/request/order.dto';
import { generateCode } from 'src/helpers/order_code_generator';
import { UserDto } from 'src/dto/response/user.dto';
import { LegitCheckStatus, Prisma, Role } from '@prisma/client';
import { ServiceDto } from 'src/dto/response/service.dto';
import { VoucherDto } from 'src/dto/response/voucher.dto';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async create(clientInfo: UserDto, createOrderDto: CreateOrderDto) {
    this.logger.debug(`Create order ${JSON.stringify(createOrderDto)}`);

    try {
      let service = await this.prismaService.services.findUnique({
        where: { id: createOrderDto.service_id },
      });

      let newService: ServiceDto = {
        ...service,
        normal_price: service.normal_price.toString(),
        vip_price: service.vip_price.toString(),
      };

      // TODO: add validation for refund (one time only)
      // TODO: add validation for one user one time only
      let voucher: VoucherDto;
      if (createOrderDto.voucher_id && createOrderDto.voucher_id.length > 0) {
        voucher = await this.prismaService.voucher.findUnique({
          where: { id: createOrderDto.voucher_id },
        });

        const now = new Date(Date.now());
        if (now < voucher.started_at || now > voucher.expired_at) {
          throw new HttpException('Voucher not valid', 400);
        }
      }

      const original_amount = countTotalOriginalAmount(
        clientInfo.role,
        newService,
      );

      const order = await this.prismaService.order.create({
        data: {
          code: generateCode('OD'),
          legit_check_id: createOrderDto.legit_check_id,
          service_id: createOrderDto.service_id,
          original_amount: original_amount,
          voucher_id: createOrderDto.voucher_id,
        },
      });

      await this.prismaService.legitChecks.update({
        where: { id: createOrderDto.legit_check_id },
        data: {
          check_status: LegitCheckStatus.payment,
        },
      });

      return { ...order, original_amount: order.original_amount.toString() };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException("order already created", 400);
        }
      }
      throw new HttpException(error.message, 500);
    }
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

    const ordersRes = orders.map((e) => {
      return {
        ...e,
        original_amount: e.original_amount.toString(),
      };
    });

    return ordersRes;
  }

  async findOne(id: string) {
    this.logger.debug(`Get order by id ${id}`);

    const order = await this.prismaService.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    return { ...order, original_amount: order.original_amount.toString() };
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
    return {
      ...updatedOrder,
      original_amount: updatedOrder.original_amount.toString(),
    };
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

function countTotalOriginalAmount(role: Role, service: ServiceDto): number {
  let result: number;

  role == Role.vip_client
    ? (result = +service.vip_price)
    : (result = +service.normal_price);

  return result;
}

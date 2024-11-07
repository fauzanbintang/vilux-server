import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  LegitCheckStatus,
  LegitStatus,
  PaymentStatus,
  Prisma,
  Role,
  VoucherType,
} from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  NotificationConst,
  NotificationTypeConst,
} from 'src/assets/constants';
import { PrismaService } from 'src/common/prisma.service';
import { CreateCertificateDto } from 'src/dto/request/file.dto';
import {
  LegitCheckBrandCategoryDto,
  LegitCheckCompletedDto,
  LegitCheckImagesDto,
  LegitCheckPaginationQuery,
  LegitCheckValidateDataDto,
} from 'src/dto/request/legit_check.dto';
import { MultipleNotificationDto } from 'src/dto/request/notification.dto';
import { FileDto } from 'src/dto/response/file.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';
import { UserDto } from 'src/dto/response/user.dto';
import { FileService } from 'src/file/file.service';
import {
  sendNotificationToMultipleTokens,
  tokenToArrayString,
} from 'src/helpers/firebase-messaging';
import { generateCode } from 'src/helpers/order_code_generator';
import { PaymentService } from 'src/payment/payment.service';
import { array } from 'zod';

@Injectable()
export class LegitCheckService {
  constructor(
    private prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly paymentService: PaymentService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async upsertLegitCheckBrandCategory(
    clientInfo: UserDto,
    brandCategoryDto: LegitCheckBrandCategoryDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Upsert legit check: brand category ${JSON.stringify(brandCategoryDto)}`,
    );

    var legitCheck: LegitCheckDto;
    if (brandCategoryDto.id && brandCategoryDto.id.length !== 0) {
      legitCheck = await this.prismaService.legitChecks.update({
        where: { id: brandCategoryDto.id },
        data: brandCategoryDto,
        select: {
          id: true,
          updated_at: true,
          created_at: true,
          client_id: true,
          code: true,
          brand_id: true,
          category_id: true,
          subcategory_id: true,
          check_status: true,
        },
      });
    } else {
      const codePrefix = clientInfo.role === Role.vip_client ? 'VIP' : 'NL';
      legitCheck = await this.prismaService.legitChecks.create({
        data: {
          client_id: clientInfo.id,
          code: generateCode(codePrefix),
          brand_id: brandCategoryDto.brand_id,
          category_id: brandCategoryDto.category_id,
          subcategory_id: brandCategoryDto.subcategory_id,
          check_status: LegitCheckStatus.brand_category,
        },
        select: {
          id: true,
          updated_at: true,
          created_at: true,
          client_id: true,
          code: true,
          brand_id: true,
          category_id: true,
          subcategory_id: true,
          check_status: true,
        },
      });
    }

    return legitCheck;
  }

  async upsertLegitCheckImages(
    id: string,
    legitCheckImagesDto: LegitCheckImagesDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Upsert legit check: images ${JSON.stringify(legitCheckImagesDto)}`,
    );

    legitCheckImagesDto.legit_check_images.forEach(async (v) => {
      // for now, additional legitCheckImage will always create new
      const legitCheckImage =
        await this.prismaService.legitCheckImages.findFirst({
          where: {
            legit_check_id: id,
            subcategory_instruction_id: v.subcategory_instruction_id,
          },
          select: { id: true },
        });

      if (legitCheckImage) {
        await this.prismaService.legitCheckImages.update({
          where: { id: legitCheckImage.id },
          data: {
            file_id: v.file_id,
          },
        });
      } else {
        await this.prismaService.legitCheckImages.create({
          data: {
            legit_check_id: id,
            file_id: v.file_id,
            subcategory_instruction_id: v.subcategory_instruction_id,
          },
        });
      }
    });

    let legitCheck: LegitCheckDto = await this.prismaService.legitChecks.update(
      {
        where: { id },
        data: {
          product_name: legitCheckImagesDto.product_name,
          client_note: legitCheckImagesDto.client_note,
          check_status: LegitCheckStatus.upload_data,
        },
        select: {
          id: true,
          updated_at: true,
          created_at: true,
          client_id: true,
          code: true,
          brand_id: true,
          category_id: true,
          subcategory_id: true,
          check_status: true,
          product_name: true,
          client_note: true,
        },
      },
    );

    return legitCheck;
  }

  async updateLegitCheckValidateData(
    id: string,
    legitCheckValidateDataDto: LegitCheckValidateDataDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Update legit check: validate data ${JSON.stringify(legitCheckValidateDataDto)}`,
    );

    let flag: boolean = true;
    await Promise.all(
      legitCheckValidateDataDto.legit_check_images.map(async (v) => {
        if (v.status == false) {
          flag = false;
        }
        return this.prismaService.legitCheckImages.update({
          where: { id: v.legit_check_image_id },
          data: {
            status: v.status,
          },
        });
      }),
    );

    const legitCheckImages = await this.prismaService.legitCheckImages.findMany(
      {
        where: { legit_check_id: id, status: null },
      },
    );

    if (legitCheckImages.length > 0) {
      throw new HttpException('please input status for all the images', 400);
    }

    let updatedLegitCheck: LegitCheckDto =
      await this.prismaService.legitChecks.update({
        where: { id },
        data: {
          admin_note: legitCheckValidateDataDto.admin_note,
          check_status: flag
            ? LegitCheckStatus.legit_checking
            : LegitCheckStatus.revise_data,
          watched: false,
        },
      });

    const legitCheck = await this.prismaService.legitChecks.findUnique({
      where: { id: id },
      select: {
        id: true,
        client_id: true,
        Order: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    if (flag) {
      await this.sendApprovedDataNotif(
        legitCheck.client_id,
        legitCheck.Order.code,
        id,
      );
    } else {
      await this.sendRejectedDataNotif(
        legitCheck.client_id,
        legitCheck.Order.code,
        id,
      );
    }

    return updatedLegitCheck;
  }

  async updateLegitCheckCompleted(
    id: string,
    legitCheckCompletedDto: LegitCheckCompletedDto,
    clientInfo: UserDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Update legit check: completed ${JSON.stringify(legitCheckCompletedDto)}`,
    );

    const legitCheck = await this.prismaService.legitChecks.findUnique({
      where: { id },
      include: {
        LegitCheckImages: {
          orderBy: {
            subcategory_instruction: {
              sort_order: 'asc',
            },
          },
        },
        Order: {
          select: { id: true },
        },
      },
    });

    if (!legitCheck) {
      throw new HttpException('legit check not found', 404);
    }

    let dataCertificate: CreateCertificateDto = {
      frameId: '',
      contentId: legitCheck.LegitCheckImages[0].file_id,
      code: generateCode(clientInfo.certificate_prefix).slice(0, -5),
    };
    let certificate: FileDto;
    if (legitCheckCompletedDto.legit_status == LegitStatus.authentic) {
      const frame = await this.fileService.findByFileName('authentic-frame');
      dataCertificate.frameId = frame.id;
    } else if (legitCheckCompletedDto.legit_status == LegitStatus.fake) {
      const frame = await this.fileService.findByFileName('fake-frame');
      dataCertificate.frameId = frame.id;
    }

    if (legitCheckCompletedDto.legit_status !== LegitStatus.unidentified) {
      certificate = await this.fileService.mergeImages(dataCertificate);
      await this.sendSuccessLegitCheckNotif(
        clientInfo.id,
        legitCheck.Order.id,
        id,
      );
    }

    if (legitCheckCompletedDto.legit_status == LegitStatus.unidentified) {
      await this.prismaService.voucher.create({
        data: {
          name: 'Refund Voucher',
          voucher_type: VoucherType.refund,
          started_at: new Date(),
          expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          discount: 100,
          user_id: clientInfo.id,
        },
      });
      this.sendUnidentifiedLegitCheckNotif(clientInfo.id);
    }

    let updatedLegitCheck: LegitCheckDto =
      await this.prismaService.legitChecks.update({
        where: { id },
        data: {
          certificate_code: dataCertificate.code,
          certificate_id: certificate ? certificate.id : null,
          legit_status: legitCheckCompletedDto.legit_status,
          admin_note: legitCheckCompletedDto.admin_note,
          check_status: LegitCheckStatus.completed,
        },
      });

    return updatedLegitCheck;
  }

  async getPaginatedLegitChecks(
    query: LegitCheckPaginationQuery,
  ): Promise<any> {
    this.logger.debug(
      `Get paginated legit check with query: ${JSON.stringify(query)}`,
    );

    const { check_status, user_id, search, payment_status, page, limit } =
      query;

    const whereClause: any = {
      check_status: { in: check_status },
      client_id: user_id,
      Order: payment_status?.length
        ? { payment: { status: { in: payment_status } } }
        : {},
    };

    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { product_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const count = await this.prismaService.legitChecks.count({
      where: whereClause,
    });

    let legitChecks = await this.prismaService.legitChecks.findMany({
      skip: (+page - 1) * +limit,
      take: +limit,
      where: whereClause,
      select: {
        id: true,
        product_name: true,
        check_status: true,
        legit_status: true,
        code: true,
        watched: true,
        created_at: true,
        updated_at: true,
        status_log: true,
        client: {
          select: {
            id: true,
            username: true,
            full_name: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        LegitCheckImages: {
          select: {
            id: true,
            file: {
              select: {
                id: true,
                path: true,
                file_name: true,
                url: true,
              },
            },
            subcategory_instruction: {
              select: {
                id: true,
                name: true,
                sort_order: true,
              },
            },
          },
          orderBy: {
            subcategory_instruction: {
              sort_order: 'asc',
            },
          },
        },
        Order: {
          select: {
            id: true,
            code: true,
            service: {
              select: {
                id: true,
                name: true,
                working_hours: true,
              },
            },
            payment: {
              select: {
                status: true,
                client_amount: true,
                method: true,
              },
            },
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    if (
      [LegitCheckStatus.legit_checking, LegitCheckStatus.data_validation].some(
        (status) => check_status.includes(status),
      )
    ) {
      const [expired, valid] = legitChecks.reduce<[any[], any[]]>(
        (acc, lc) => {
          const { status_log, Order } = lc;
          const dataValidationDate = status_log?.['data_validation'];
          const workingHours = Order?.service?.working_hours;

          if (dataValidationDate && workingHours != null) {
            const expirationTime =
              dataValidationDate + workingHours * 60 * 60 * 1000;
            acc[expirationTime <= Date.now() ? 0 : 1].push(lc);
          } else {
            acc[1].push(lc);
          }

          return acc;
        },
        [[], []],
      );

      legitChecks = valid.concat(expired);
    }

    return { count, legitChecks };
  }

  async getTopBrands(limit: number): Promise<any[]> {
    this.logger.debug(`Get top ${limit} brands by successful legit checks`);

    const topBrands = await this.prismaService.legitChecks.groupBy({
      by: ['brand_id'],
      _count: {
        brand_id: true,
      },
      where: {
        Order: {
          payment: {
            status: 'success',
          },
        },
      },
      orderBy: {
        _count: {
          brand_id: 'desc',
        },
      },
      take: limit,
    });

    const brandDetails = await this.prismaService.brand.findMany({
      where: {
        id: {
          in: topBrands.map((brand) => brand.brand_id),
        },
      },
      select: {
        id: true,
        name: true,
        file: {
          select: {
            url: true,
          },
        },
      },
    });

    return topBrands.map((brand) => ({
      id: brand.brand_id,
      name: brandDetails.find((b) => b.id === brand.brand_id)?.name,
      logoUrl: brandDetails.find((b) => b.id === brand.brand_id)?.file?.url,
      count: brand._count.brand_id,
    }));
  }

  async getDetailLegitCheck(id: string): Promise<any> {
    this.logger.debug(`Get detail legit check with id: ${JSON.stringify(id)}`);

    const legitCheck = await this.prismaService.legitChecks.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        product_name: true,
        check_status: true,
        legit_status: true,
        code: true,
        updated_at: true, // confirm again to Ryan
        client_note: true,
        admin_note: true,
        watched: true,
        status_log: true,
        client: true,
        brand: {
          select: {
            id: true,
            name: true,
            file: {
              select: {
                id: true,
                path: true,
                file_name: true,
                url: true,
              },
            },
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        Order: {
          select: {
            id: true,
            code: true,
            service: {
              select: {
                id: true,
                name: true,
                working_hours: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
                amount: true,
                client_amount: true,
                method: true,
              },
            },
          },
        },
        LegitCheckImages: {
          select: {
            id: true,
            status: true,
            file: {
              select: {
                id: true,
                path: true,
                file_name: true,
                url: true,
              },
            },
            subcategory_instruction: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        certificate: {
          select: {
            id: true,
            path: true,
            file_name: true,
            url: true,
          },
        },
      },
    });

    const checkPaymentStatus = await this.paymentService.checkPaymentStatusMidtrans(legitCheck.Order.payment.id);

    if (checkPaymentStatus.transaction_status !== 'settlement' || checkPaymentStatus.transaction_status !== 'pending') {
      legitCheck.Order.payment = await this.paymentService.create({
        amount: legitCheck.Order.payment.amount,
        client_amount: legitCheck.Order.payment.client_amount,
      }, legitCheck.client, legitCheck.Order.id);
    }

    return legitCheck;
  }

  async patchWatch(id: string) {
    const legitCheck = await this.prismaService.legitChecks.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!legitCheck) {
      throw new HttpException('legitCheck not found', 404);
    }

    await this.prismaService.legitChecks.update({
      where: { id },
      data: {
        watched: true,
      },
    });
  }

  async getUnwatched() {
    const counts = await this.prismaService.legitChecks.groupBy({
      by: ['check_status'],
      where: {
        check_status: {
          in: ['data_validation', 'legit_checking'],
        },
        watched: false,
      },
      _count: {
        check_status: true,
      },
    });

    const result = counts.reduce(
      (acc, count) => {
        if (count.check_status === 'data_validation') {
          acc.unwatched.data_validation = count._count.check_status;
        } else if (count.check_status === 'legit_checking') {
          acc.unwatched.legit_checking = count._count.check_status;
        }
        return acc;
      },
      {
        unwatched: {
          data_validation: 0,
          legit_checking: 0,
        },
      },
    );

    return result;
  }

  async getReturnedChecks(clientInfo: UserDto) {
    const counts = await this.prismaService.legitChecks.groupBy({
      by: ['check_status'],
      where: {
        check_status: {
          in: ['revise_data'],
        },
        client_id: clientInfo.id,
      },
      _count: {
        check_status: true,
      },
    });

    const result = counts.reduce(
      (acc, count) => {
        acc.returned = count._count.check_status;
        return acc;
      },
      {
        returned: 0,
      },
    );

    return result;
  }

  async getCompletedChecks() {
    const counts = await this.prismaService.legitChecks.groupBy({
      by: ['check_status'],
      where: {
        check_status: {
          in: ['completed'],
        },
      },
      _count: {
        check_status: true,
      },
    });

    const result = counts.reduce(
      (acc, count) => {
        acc.completed = count._count.check_status;
        return acc;
      },
      {
        completed: 0,
      },
    );

    return result;
  }

  async sendApprovedDataNotif(
    userId: string,
    orderCode: string,
    legitCheckId: string,
  ) {
    const userTokens = await this.prismaService.fCMToken.findMany({
      select: {
        token: true,
      },
      where: {
        user_id: userId,
      },
    });

    const notifDataUser: MultipleNotificationDto = {
      tokens: tokenToArrayString(userTokens),
      title: NotificationConst.ApprovedDataValidation.title,
      body: NotificationConst.ApprovedDataValidation.body,
      data: {
        type: NotificationTypeConst.DetailOrderUser,
        order_code: orderCode,
        legit_check_id: legitCheckId,
      },
    };

    await sendNotificationToMultipleTokens(notifDataUser);
  }

  async sendRejectedDataNotif(
    userId: string,
    orderCode: string,
    legitCheckId: string,
  ) {
    const userTokens = await this.prismaService.fCMToken.findMany({
      select: {
        token: true,
      },
      where: {
        user_id: userId,
      },
    });

    const notifDataUser: MultipleNotificationDto = {
      tokens: tokenToArrayString(userTokens),
      title: NotificationConst.RejectedDataValidation.title,
      body: NotificationConst.RejectedDataValidation.body,
      data: {
        type: NotificationTypeConst.DetailRejectOrderUser,
        order_code: orderCode,
        legit_check_id: legitCheckId,
      },
    };

    await sendNotificationToMultipleTokens(notifDataUser);
  }

  async sendSuccessLegitCheckNotif(
    userId: string,
    orderCode: string,
    legitCheckId: string,
  ) {
    const userTokens = await this.prismaService.fCMToken.findMany({
      select: {
        token: true,
      },
      where: {
        user_id: userId,
      },
    });

    const notifDataUser: MultipleNotificationDto = {
      tokens: tokenToArrayString(userTokens),
      title: NotificationConst.DoneLegitCheck.title,
      body: NotificationConst.DoneLegitCheck.body,
      data: {
        type: NotificationTypeConst.DetailOrderUser,
        order_code: orderCode,
        legit_check_id: legitCheckId,
      },
    };

    await sendNotificationToMultipleTokens(notifDataUser);
  }

  async sendUnidentifiedLegitCheckNotif(userId: string) {
    const userTokens = await this.prismaService.fCMToken.findMany({
      select: {
        token: true,
      },
      where: {
        user_id: userId,
      },
    });

    const notifDataUser: MultipleNotificationDto = {
      tokens: tokenToArrayString(userTokens),
      title: NotificationConst.UnidentifiedLegitCheck.title,
      body: NotificationConst.UnidentifiedLegitCheck.body,
      data: {
        type: NotificationTypeConst.DetailVoucherUser,
      },
    };

    await sendNotificationToMultipleTokens(notifDataUser);
  }

  async reviseLegitCheckImages(
    id: string,
    legitCheckImagesDto: LegitCheckImagesDto,
  ): Promise<LegitCheckDto> {
    this.logger.debug(
      `Revise legit check: images ${JSON.stringify(legitCheckImagesDto)}`,
    );

    let legitCheck = await this.prismaService.legitChecks.findUnique({
      select: {
        id: true,
        check_status: true,
        Order: {
          select: {
            id: true,
            code: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    if (legitCheck?.check_status != LegitCheckStatus.revise_data) {
      throw new HttpException(
        'Invalid check_status, should be from revise_data',
        400,
      );
    }

    legitCheckImagesDto.legit_check_images.forEach(async (v) => {
      // for now, additional legitCheckImage will always create new
      const legitCheckImage =
        await this.prismaService.legitCheckImages.findFirst({
          where: {
            legit_check_id: id,
            subcategory_instruction_id: v.subcategory_instruction_id,
          },
          select: { id: true },
        });

      if (legitCheckImage) {
        await this.prismaService.legitCheckImages.update({
          where: { id: legitCheckImage.id },
          data: {
            file_id: v.file_id,
          },
        });
      } else {
        await this.prismaService.legitCheckImages.create({
          data: {
            legit_check_id: id,
            file_id: v.file_id,
            subcategory_instruction_id: v.subcategory_instruction_id,
          },
        });
      }
    });

    let updatedLegitCheck: LegitCheckDto =
      await this.prismaService.legitChecks.update({
        where: { id },
        data: {
          check_status: LegitCheckStatus.data_validation,
        },
        select: {
          id: true,
          updated_at: true,
          created_at: true,
          client_id: true,
          code: true,
          brand_id: true,
          category_id: true,
          subcategory_id: true,
          check_status: true,
          product_name: true,
          client_note: true,
        },
      });

    this.sendRevisedNotif(legitCheck.Order.code, id);

    return updatedLegitCheck;
  }

  async sendRevisedNotif(orderCode: string, legitCheckId: string) {
    const adminTokens = await this.prismaService.fCMToken.findMany({
      select: {
        token: true,
      },
      where: {
        role: Role.admin,
      },
    });

    const notifDataAdmin: MultipleNotificationDto = {
      tokens: tokenToArrayString(adminTokens),
      title: NotificationConst.RevisedData.title.replace(
        '[order_id]',
        orderCode,
      ),
      body: NotificationConst.RevisedData.body,
      data: {
        type: NotificationTypeConst.DetailOrderCMS,
        order_code: orderCode,
        legit_check_id: legitCheckId,
      },
    };

    await sendNotificationToMultipleTokens(notifDataAdmin);
  }
}

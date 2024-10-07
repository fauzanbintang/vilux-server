import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { LegitCheckStatus, Role } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { CreateCertificateDto } from 'src/dto/request/file.dto';
import {
  LegitCheckBrandCategoryDto,
  LegitCheckCompletedDto,
  LegitCheckImagesDto,
  LegitCheckPaginationQuery,
  LegitCheckValidateDataDto,
} from 'src/dto/request/legit_check.dto';
import { FileDto } from 'src/dto/response/file.dto';
import { LegitCheckDto } from 'src/dto/response/legit_check.dto';
import { UserDto } from 'src/dto/response/user.dto';
import { FileService } from 'src/file/file.service';
import { generateCode } from 'src/helpers/order_code_generator';

@Injectable()
export class LegitCheckService {
  constructor(
    private prismaService: PrismaService,
    private readonly fileService: FileService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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
        },
      });

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
        LegitCheckImages: true,
      },
    });

    if (!legitCheck) {
      throw new HttpException('legit check not found', 404);
    }

    let dataCertificate: CreateCertificateDto = {
      frameId: '',
      contentId: legitCheck.LegitCheckImages[0].id,
      code: generateCode(clientInfo.certificate_prefix),
    };
    let certificate: FileDto;
    if (legitCheck.legit_status == 'authentic') {
      const frame = await this.fileService.findByFileName('authentic-frame');
      dataCertificate.frameId = frame.id;
    } else if (legitCheck.legit_status == 'fake') {
      const frame = await this.fileService.findByFileName('fake-frame');
      dataCertificate.frameId = frame.id;
    }

    // create voucher referral if legit check is unidentified
    if (legitCheck.legit_status !== 'unidentified') {
      certificate = await this.fileService.mergeImages(dataCertificate);
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

    let whereClause = {
      check_status: {
        in: query.check_status,
      },
      client_id: query.user_id,
      Order: {},
    };

    if (query.payment_status && query.payment_status.length >= 1) {
      whereClause = {
        ...whereClause,
        Order: {
          some: {
            payment: {
              status: {
                in: query.payment_status,
              },
            },
          },
        },
      };
    }

    const count = await this.prismaService.legitChecks.count({
      where: whereClause,
    });

    const legitChecks = await this.prismaService.legitChecks.findMany({
      skip: (+query.page - 1) * +query.limit,
      take: +query.limit,
      where: whereClause,
      select: {
        id: true,
        product_name: true,
        check_status: true,
        legit_status: true,
        code: true,
        client: {
          select: {
            id: true,
            username: true,
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
              },
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
    });

    return {
      count,
      legitChecks,
    };
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
        Order: {
          select: {
            id: true,
            code: true,
            service: {
              select: {
                id: true,
                name: true,
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

    return legitCheck;
  }
}

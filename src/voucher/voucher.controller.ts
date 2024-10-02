import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import {
  CreateVoucherPromotionDto,
  CreateVoucherReferralDto,
  GetVouchersnQuery,
  UpdateVoucherPromotionDto,
  UpdateVoucherReferralDto,
} from 'src/dto/request/voucher.dto';
import { ResponseDto } from 'src/dto/response/response.dto';
import { VoucherDto } from 'src/dto/response/voucher.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VoucherType } from '@prisma/client';

@ApiTags('voucher')
@Controller('api/vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('promotion')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a voucher promotion' })
  @ApiResponse({
    status: 201,
    description: 'Create a voucher promotion',
    schema: {
      example: {
        message: 'Successfully create a voucher promotion',
        data: {
          id: 'daf0fea7-2ecf-47c7-87cb-2bba7168cc0c',
          updated_at: '2024-10-01T16:48:56.335Z',
          created_at: '2024-10-01T16:48:56.335Z',
          name: 'New Member',
          voucher_type: 'promotion',
          started_at: '2023-12-31T17:00:00.000Z',
          expired_at: '2024-12-31T17:00:00.000Z',
          used: false,
          discount: 20,
          code: null,
          user_id: null,
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
  async createPromotion(
    @Body() createVoucherDto: CreateVoucherPromotionDto,
  ): Promise<ResponseDto<VoucherDto>> {
    const data = await this.voucherService.create(
      createVoucherDto,
      VoucherType.promotion,
    );

    return {
      message: 'Successfully create a voucher promotion',
      data,
      errors: null,
    };
  }

  @Post('referral')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a voucher referral' })
  @ApiResponse({
    status: 201,
    description: 'Create a voucher referral',
    schema: {
      example: {
        message: 'Successfully create a voucher referral',
        data: {
          id: '9b84da74-2b37-457d-a42f-dff6797cffc4',
          updated_at: '2024-10-01T16:59:24.570Z',
          created_at: '2024-10-01T16:59:24.570Z',
          name: 'New Member',
          voucher_type: 'referral',
          started_at: '2023-12-31T17:00:00.000Z',
          expired_at: '2025-12-31T17:00:00.000Z',
          used: false,
          discount: null,
          code: 'JF839H0S',
          user_id: '1285f70b-cf35-4a1b-afed-f7be4c777657',
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
  async createReferral(
    @Body() createVoucherDto: CreateVoucherReferralDto,
  ): Promise<ResponseDto<VoucherDto>> {
    const data = await this.voucherService.create(
      createVoucherDto,
      VoucherType.referral,
    );

    return {
      message: 'Successfully create a voucher referral',
      data,
      errors: null,
    };
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({
    status: 200,
    description: 'Get all vouchers',
    schema: {
      example: {
        message: 'Successfully get all vouchers',
        data: [
          {
            id: 'daf0fea7-2ecf-47c7-87cb-2bba7168cc0c',
            name: 'New Member New',
            voucher_type: 'promotion',
            started_at: '2024-12-01T17:00:00.000Z',
            expired_at: '2024-12-31T17:00:00.000Z',
            used: false,
            discount: 20,
            code: null,
            user_id: null,
          },
          {
            id: '9b84da74-2b37-457d-a42f-dff6797cffc4',
            name: 'New Member',
            voucher_type: 'referral',
            started_at: '2023-12-31T17:00:00.000Z',
            expired_at: '2025-12-31T17:00:00.000Z',
            used: false,
            discount: null,
            code: 'JF839H0S',
            user_id: '1285f70b-cf35-4a1b-afed-f7be4c777657',
          },
        ],
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
  async findAll(
    @Query() query: GetVouchersnQuery,
  ): Promise<ResponseDto<VoucherDto[]>> {
    query.voucher_type = Array.isArray(query.voucher_type)
      ? query.voucher_type
      : [query.voucher_type];

    const data = await this.voucherService.findAll(query);

    return {
      message: 'Successfully get all vouchers',
      data,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get voucher detail' })
  @ApiResponse({
    status: 200,
    description: 'Get voucher detail',
    schema: {
      example: {
        message: 'Successfully get voucher detail',
        data: {
          id: '9b84da74-2b37-457d-a42f-dff6797cffc4',
          updated_at: '2024-10-01T16:59:24.570Z',
          created_at: '2024-10-01T16:59:24.570Z',
          name: 'New Member',
          voucher_type: 'referral',
          started_at: '2023-12-31T17:00:00.000Z',
          expired_at: '2025-12-31T17:00:00.000Z',
          used: false,
          discount: null,
          code: 'JF839H0S',
          user_id: '1285f70b-cf35-4a1b-afed-f7be4c777657',
          user: {
            id: '1285f70b-cf35-4a1b-afed-f7be4c777657',
            full_name: 'Client Vilux',
            email: 'client@vilux.id',
          },
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
  async findOne(@Param('id') id: string): Promise<ResponseDto<VoucherDto>> {
    const data = await this.voucherService.findOne(id);

    return {
      message: 'Successfully get voucher detail',
      data,
      errors: null,
    };
  }

  @Put(':id/promotion')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a voucher promotion' })
  @ApiResponse({
    status: 200,
    description: 'Update a voucher promotion',
    schema: {
      example: {
        message: 'Successfully update a voucher promotion',
        data: {
          id: 'daf0fea7-2ecf-47c7-87cb-2bba7168cc0c',
          updated_at: '2024-10-01T16:52:28.217Z',
          created_at: '2024-10-01T16:48:56.335Z',
          name: 'New Member New',
          voucher_type: 'promotion',
          started_at: '2024-12-01T17:00:00.000Z',
          expired_at: '2024-12-31T17:00:00.000Z',
          used: false,
          discount: 20,
          code: null,
          user_id: null,
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
  async updatePromotion(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherPromotionDto,
  ): Promise<ResponseDto<VoucherDto>> {
    const data = await this.voucherService.update(id, updateVoucherDto);

    return {
      message: 'Successfully update a voucher promotion',
      data,
      errors: null,
    };
  }

  @Put(':id/referral')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a voucher referral' })
  @ApiResponse({
    status: 200,
    description: 'Update a voucher referral',
    schema: {
      example: {
        message: 'Successfully update a voucher referral',
        data: {
          id: '9b84da74-2b37-457d-a42f-dff6797cffc4',
          updated_at: '2024-10-01T17:05:33.188Z',
          created_at: '2024-10-01T16:59:24.570Z',
          name: 'New Member New',
          voucher_type: 'referral',
          started_at: '1998-12-31T17:00:00.000Z',
          expired_at: '2025-12-31T17:00:00.000Z',
          used: false,
          discount: null,
          code: 'JF839H0S',
          user_id: 'df04f194-dd54-4664-ac10-5e149cbf770f',
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
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherReferralDto,
  ): Promise<ResponseDto<VoucherDto>> {
    const data = await this.voucherService.update(id, updateVoucherDto);

    return {
      message: 'Successfully update a voucher referral',
      data,
      errors: null,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a voucher' })
  @ApiResponse({
    status: 200,
    description: 'Delete a voucher',
    schema: {
      example: {
        message: 'Successfully delete a voucher',
        data: null,
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
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.voucherService.remove(id);

    return {
      message: 'Successfully delete a voucher',
      data: null,
      errors: null,
    };
  }
}

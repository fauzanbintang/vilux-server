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
import { VoucherService } from './voucher.service';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
} from 'src/dto/request/voucher.dto';
import { DeleteDto, ResponseDto } from 'src/dto/response/response.dto';
import { VoucherDto } from 'src/dto/response/voucher.dto';

@Controller('/api/vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('/')
  @HttpCode(201)
  async create(
    @Body() createVoucherDto: CreateVoucherDto,
  ): Promise<ResponseDto<VoucherDto>> {
    return await this.voucherService.create(createVoucherDto);
  }

  @Get('/')
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<VoucherDto[]>> {
    return await this.voucherService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<VoucherDto>> {
    return await this.voucherService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ): Promise<ResponseDto<VoucherDto>> {
    return await this.voucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<DeleteDto>> {
    return await this.voucherService.remove(id);
  }
}

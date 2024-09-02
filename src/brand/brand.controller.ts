import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { CreateBrandDto, UpdateBrandDto } from 'src/dto/request/brand.dto';
import { BrandDto } from 'src/dto/response/brand.dto';

@ApiTags('brand')
@Controller('api/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<ResponseDto<BrandDto>> {
    const brand = await this.brandService.create(createBrandDto);
    return { data: brand };
  }

  @Get()
  @HttpCode(200)
  async findAll(): Promise<ResponseDto<BrandDto[]>> {
    const brands = await this.brandService.findAll();
    return { data: brands };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<ResponseDto<BrandDto>> {
    const brand = await this.brandService.findOne(id);
    return { data: brand };
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<ResponseDto<BrandDto>> {
    const brand = await this.brandService.update(id, updateBrandDto);
    return { data: brand };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<ResponseDto<string>> {
    await this.brandService.remove(id);

    return { message: 'successfully delete a brand' };
  }
}

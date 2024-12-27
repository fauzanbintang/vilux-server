import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    type: String,
    default: 'Nike',
  })
  name: string;

  @ApiProperty({
    type: BigInt,
    default: 0
  })
  additional_price: bigint
  
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class BrandPaginationQuery {
  @ApiProperty({
    type: String,
    default: '1',
  })
  page?: string;

  @ApiProperty({
    type: String,
    default: '10',
  })
  limit?: string;

  @ApiPropertyOptional({
    type: String,
    default: 'test',
  })
  search?: string;
}
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    type: String,
    default: 'fast checking',
  })
  name: string;

  @ApiProperty({
    type: Number,
    default: 3,
  })
  working_hours: number;

  @ApiProperty({
    type: BigInt,
    default: 195000,
  })
  normal_price: bigint;

  @ApiProperty({
    type: BigInt,
    default: 160000,
  })
  vip_price: bigint;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

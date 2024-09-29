import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ServiceDto {
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
    type: String,
    default: 195000,
  })
  normal_price: string;

  @ApiProperty({
    type: String,
    default: 160000,
  })
  vip_price: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    default: '2024-01-01T01::41.495Z',
  })
  created_at: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    default: '2024-01-01T01::41.495Z',
  })
  updated_at: Date;
}

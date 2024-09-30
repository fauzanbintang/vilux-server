import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LegitCheckStatus, LegitStatus } from '@prisma/client';

export class LegitCheckDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

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

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  client_id: string;

  @ApiProperty({
    type: String,
    default: 'NL01J91GB5YH0',
  })
  code: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  brand_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  category_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  subcategory_id: string;

  @ApiProperty({
    enum: LegitCheckStatus,
    default: LegitCheckStatus.completed,
  })
  check_status: string;

  @ApiPropertyOptional({
    type: String,
    default: 'Armani Clutch',
  })
  product_name?: string;

  @ApiPropertyOptional({
    type: String,
    default: 'This is note',
  })
  client_note?: string;



  @ApiProperty({
    enum: LegitStatus,
    default: LegitStatus.authentic,
  })
  legit_status?: string;

  @ApiProperty({
    type: String,
    default: 'This is note',
  })
  admin_note?: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  cover_id?: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  certificate_id?: string;
}

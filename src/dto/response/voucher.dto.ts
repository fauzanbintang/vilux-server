import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType } from '@prisma/client';

export class VoucherDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    type: String,
    default: 'New Member',
  })
  name: string;

  @ApiProperty({
    enum: VoucherType,
    default: VoucherType.promotion,
  })
  voucher_type: VoucherType;

  @ApiProperty({
    type: Date,
    default: new Date('01-01-1999'),
  })
  started_at: Date;

  @ApiProperty({
    type: Date,
    default: new Date('01-01-1999'),
  })
  expired_at: Date;

  @ApiPropertyOptional({
    type: Number,
    default: 20,
  })
  discount?: number;

  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  user_id?: string;

  @ApiPropertyOptional({
    type: String,
    default: 'JF839H0S',
  })
  code?: string;
}

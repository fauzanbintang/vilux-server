import { ApiProperty, PartialType } from '@nestjs/swagger';
import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
  @ApiProperty({
    type: String,
    default: 'test',
  })
  name: string;

  @ApiProperty({
    type: String,
    default: 'test',
  })
  code: string;

  @ApiProperty({
    enum: VoucherType,
    default: VoucherType.promotion,
  })
  voucher_type: VoucherType;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  discount: string;

  @ApiProperty({
    type: Number,
    default: 200,
  })
  quota_usage: number;

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

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  active_status: boolean;
}

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {}

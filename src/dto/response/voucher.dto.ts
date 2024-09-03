import { ApiProperty } from '@nestjs/swagger';
import { VoucherType } from '@prisma/client';

export class VoucherDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

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

  // @ApiProperty({
  //   type: VoucherType,
  //   default: 'promotion',
  // })
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

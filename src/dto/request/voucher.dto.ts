import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Voucher, VoucherType } from '@prisma/client';

export class CreateVoucherPromotionDto {
  @ApiProperty({
    type: String,
    default: 'New Member',
  })
  name: string;

  @ApiProperty({
    type: Number,
    default: 20,
  })
  discount: number;

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
}

export class UpdateVoucherPromotionDto extends PartialType(
  CreateVoucherPromotionDto,
) {}

export class CreateVoucherReferralDto {
  @ApiProperty({
    type: String,
    default: 'New Member',
  })
  name: string;

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
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  user_id?: string;

  @ApiProperty({
    type: String,
    default: 'JF839H0S',
  })
  code: string;
}

export class UpdateVoucherReferralDto extends PartialType(
  CreateVoucherReferralDto,
) {}

export class GetVouchersnQuery {
  @ApiProperty({
    enum: VoucherType,
    isArray: true,
    default: [VoucherType.promotion],
  })
  voucher_type: VoucherType[];
}

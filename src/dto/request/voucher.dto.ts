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
    default: 'test@mail.com',
  })
  email?: string;

  @ApiProperty({
    type: String,
    default: 'JF839H0S',
  })
  code: string;
}

export class UpdateVoucherReferralDto extends PartialType(
  CreateVoucherReferralDto,
) {}

export enum ActiveFinished {
  active = 'active',
  finished = 'finished',
}

export class GetVouchersnQuery {
  @ApiProperty({
    enum: VoucherType,
    isArray: true,
    default: [VoucherType.promotion],
  })
  voucher_type: VoucherType[];

  @ApiProperty({
    enum: ActiveFinished,
    isArray: true,
    default: [ActiveFinished.active],
  })
  active_finished: ActiveFinished[];
}

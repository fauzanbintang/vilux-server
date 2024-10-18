import { ApiProperty } from '@nestjs/swagger';

export class HomeSummaryDto {
  @ApiProperty({
    type: Number,
    default: 1450000,
  })
  total_transaction: number;

  @ApiProperty({
    type: Number,
    default: 123,
  })
  total_user: number;

  @ApiProperty({
    type: Number,
    default: 7,
  })
  pending_transaction: number;
}

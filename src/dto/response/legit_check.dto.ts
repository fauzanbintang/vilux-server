import { ApiProperty } from '@nestjs/swagger';
import { LegitCheckStatus, LegitStatus } from '@prisma/client';

export class LegitCheckDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;
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
    enum: LegitCheckStatus,
    default: LegitCheckStatus.completed,
  })
  check_status: string;
  @ApiProperty({
    type: LegitStatus,
    default: LegitStatus.authentic,
  })
  legit_status: string;
  @ApiProperty({
    type: String,
    default: 'This is note',
  })
  client_note: string;
  @ApiProperty({
    type: String,
    default: 'This is note',
  })
  admin_note: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  cover_id: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  certificate_id: string;
}

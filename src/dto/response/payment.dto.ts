import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class PaymentDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    type: 'object',
    default: {
      data: 'test',
    },
  })
  method: JsonValue;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  amount: string;

  @ApiProperty({
    enum: PaymentStatus,
    default: 'pending',
  })
  status: PaymentStatus;

  @ApiProperty({
    type: 'object',
    default: {
      data: 'test',
    },
  })
  status_log: JsonValue;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  external_id: string;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  service_fee: string;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  client_amount: string;
}

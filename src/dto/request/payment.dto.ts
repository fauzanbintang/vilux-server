import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreatePaymentDto {
  @ApiProperty({
    type: String,
    default: '10000',
  })
  amount: string;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  client_amount: string;
}

export class UpdatePaymentDto {
  @ApiProperty({
    type: String,
  })
  status: PaymentStatus;

  @ApiProperty({
    type: String,
  })
  status_log: JsonValue;
}

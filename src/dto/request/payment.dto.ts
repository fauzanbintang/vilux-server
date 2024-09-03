import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class CreatePaymentDto {
  method: JsonValue;
  amount: string;
  status: PaymentStatus;
  status_log: JsonValue;
  external_id: string;
  service_fee: string;
  client_amount: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

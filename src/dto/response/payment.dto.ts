import { PaymentStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class PaymentDto {
  id: string;
  method: JsonValue;
  amount: string;
  status: PaymentStatus;
  status_log: JsonValue;
  external_id: string;
  service_fee: string;
  client_amount: string;
}

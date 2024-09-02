import { VoucherType } from '@prisma/client';

export class VoucherDto {
  id: string;
  name: string;
  code: string;
  voucher_type: VoucherType;
  discount: string;
  quota_usage: number;
  started_at: Date;
  expired_at: Date;
  active_status: boolean;
}

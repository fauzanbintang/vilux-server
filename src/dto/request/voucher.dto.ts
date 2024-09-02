import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
  name: string;
  code: string;
  voucher_type: VoucherType;
  discount: string;
  quota_usage: number;
  started_at: Date;
  expired_at: Date;
  active_status: string;
}

export class UpdateVoucherDto {
  name?: string;
  code?: string;
  voucher_type?: VoucherType;
  discount?: string;
  quota_usage?: number;
  started_at?: Date;
  expired_at?: Date;
  active_status?: string;
}

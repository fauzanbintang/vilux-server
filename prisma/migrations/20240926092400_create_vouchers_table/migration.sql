-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('promotion', 'referral', 'refund');

-- CreateTable
CREATE TABLE "vouchers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "voucher_type" "VoucherType" NOT NULL,
    "discount" TEXT NOT NULL,
    "quota_usage" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "active_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

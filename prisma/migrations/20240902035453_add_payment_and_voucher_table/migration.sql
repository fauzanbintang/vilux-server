-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('success', 'failed', 'pending');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('promotion', 'referral');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" JSONB NOT NULL,
    "amount" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "status_log" JSONB NOT NULL,
    "external_id" TEXT NOT NULL,
    "service_fee" TEXT NOT NULL,
    "client_amount" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

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

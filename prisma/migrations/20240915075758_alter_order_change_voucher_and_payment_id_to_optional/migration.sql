-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_voucher_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "payment_id" DROP NOT NULL,
ALTER COLUMN "voucher_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "legit_checks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

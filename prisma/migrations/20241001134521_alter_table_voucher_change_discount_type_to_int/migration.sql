/*
  Warnings:

  - You are about to drop the column `active_status` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `quota_usage` on the `vouchers` table. All the data in the column will be lost.
  - The `discount` column on the `vouchers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT;

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "active_status",
DROP COLUMN "quota_usage",
ADD COLUMN     "user_id" UUID,
ALTER COLUMN "code" DROP NOT NULL,
DROP COLUMN "discount",
ADD COLUMN     "discount" INTEGER;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

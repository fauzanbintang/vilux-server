/*
  Warnings:

  - Changed the type of `original_amount` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `service_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_service_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "original_amount",
ADD COLUMN     "original_amount" BIGINT NOT NULL,
ALTER COLUMN "service_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

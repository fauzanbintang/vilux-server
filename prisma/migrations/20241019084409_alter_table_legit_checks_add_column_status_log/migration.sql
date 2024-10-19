/*
  Warnings:

  - A unique constraint covering the columns `[legit_check_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "legit_checks" ADD COLUMN     "status_log" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "orders_legit_check_id_key" ON "orders"("legit_check_id");

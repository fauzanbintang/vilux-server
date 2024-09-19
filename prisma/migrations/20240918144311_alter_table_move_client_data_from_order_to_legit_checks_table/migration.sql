/*
  Warnings:

  - You are about to drop the column `client_info` on the `orders` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `legit_checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `legit_checks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "legit_checks" ADD COLUMN     "certificate_code" TEXT,
ADD COLUMN     "client_id" UUID NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "client_info",
ADD COLUMN     "service_id" UUID;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

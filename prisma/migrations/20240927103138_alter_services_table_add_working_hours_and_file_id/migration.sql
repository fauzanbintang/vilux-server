/*
  Warnings:

  - You are about to drop the column `fileId` on the `legit_checks` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `services` table. All the data in the column will be lost.
  - Added the required column `normal_price` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vip_price` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `working_hours` to the `services` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "legit_checks" DROP CONSTRAINT "legit_checks_fileId_fkey";

-- AlterTable
ALTER TABLE "legit_checks" DROP COLUMN "fileId",
ADD COLUMN     "file_id" UUID;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "price",
ADD COLUMN     "file_id" UUID,
ADD COLUMN     "normal_price" BIGINT NOT NULL,
ADD COLUMN     "vip_price" BIGINT NOT NULL,
ADD COLUMN     "working_hours" INTEGER NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ServicesName";

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

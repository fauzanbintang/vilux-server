/*
  Warnings:

  - You are about to drop the column `fileId` on the `brands` table. All the data in the column will be lost.
  - Added the required column `file_id` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_fileId_fkey";

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "fileId",
ADD COLUMN     "file_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

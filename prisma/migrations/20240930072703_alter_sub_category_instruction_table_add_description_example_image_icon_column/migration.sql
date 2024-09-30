/*
  Warnings:

  - You are about to drop the column `file_id` on the `subcategory_instructions` table. All the data in the column will be lost.
  - Added the required column `description` to the `subcategory_instructions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subcategory_instructions" DROP CONSTRAINT "subcategory_instructions_file_id_fkey";

-- AlterTable
ALTER TABLE "subcategory_instructions" DROP COLUMN "file_id",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "example_image_id" UUID,
ADD COLUMN     "icon_id" UUID;

-- AddForeignKey
ALTER TABLE "subcategory_instructions" ADD CONSTRAINT "subcategory_instructions_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_instructions" ADD CONSTRAINT "subcategory_instructions_example_image_id_fkey" FOREIGN KEY ("example_image_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

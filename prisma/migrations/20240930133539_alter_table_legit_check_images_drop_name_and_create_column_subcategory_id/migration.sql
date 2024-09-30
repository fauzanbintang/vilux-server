/*
  Warnings:

  - You are about to drop the column `name` on the `legit_check_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "legit_check_images" DROP COLUMN "name",
ADD COLUMN     "subcategory_instruction_id" UUID;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_subcategory_instruction_id_fkey" FOREIGN KEY ("subcategory_instruction_id") REFERENCES "subcategory_instructions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

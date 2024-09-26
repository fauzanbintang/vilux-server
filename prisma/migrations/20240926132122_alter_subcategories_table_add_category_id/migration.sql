/*
  Warnings:

  - Added the required column `category_id` to the `subcategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "category_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

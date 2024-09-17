-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_file_id_fkey";

-- DropForeignKey
ALTER TABLE "category_instructions" DROP CONSTRAINT "category_instructions_file_id_fkey";

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "file_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "category_instructions" ALTER COLUMN "file_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_instructions" ADD CONSTRAINT "category_instructions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

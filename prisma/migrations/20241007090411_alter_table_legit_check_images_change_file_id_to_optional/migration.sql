-- DropForeignKey
ALTER TABLE "legit_check_images" DROP CONSTRAINT "legit_check_images_file_id_fkey";

-- AlterTable
ALTER TABLE "legit_check_images" ALTER COLUMN "file_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

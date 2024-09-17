-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_file_id_fkey";

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "file_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

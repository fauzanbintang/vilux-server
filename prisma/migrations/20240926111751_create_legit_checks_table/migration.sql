-- CreateEnum
CREATE TYPE "LegitCheckStatus" AS ENUM ('brand_category', 'upload_data', 'payment', 'data_validation', 'revise_data', 'legit_checking', 'completed');

-- CreateEnum
CREATE TYPE "LegitStatus" AS ENUM ('authentic', 'fake', 'unidentified');

-- CreateTable
CREATE TABLE "legit_checks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "brand_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "subcategory_id" UUID NOT NULL,
    "check_status" "LegitCheckStatus" NOT NULL,
    "product_name" TEXT,
    "legit_status" "LegitStatus",
    "client_note" TEXT,
    "admin_note" TEXT,
    "cover_id" UUID,
    "certificate_code" TEXT,
    "certificate_id" UUID,
    "fileId" UUID,

    CONSTRAINT "legit_checks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

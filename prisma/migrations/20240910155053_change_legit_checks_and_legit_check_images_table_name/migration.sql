/*
  Warnings:

  - You are about to drop the `LegitCheckImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LegitChecks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LegitCheckImages" DROP CONSTRAINT "LegitCheckImages_file_id_fkey";

-- DropForeignKey
ALTER TABLE "LegitCheckImages" DROP CONSTRAINT "LegitCheckImages_legit_check_id_fkey";

-- DropForeignKey
ALTER TABLE "LegitChecks" DROP CONSTRAINT "LegitChecks_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "LegitChecks" DROP CONSTRAINT "LegitChecks_category_id_fkey";

-- DropForeignKey
ALTER TABLE "LegitChecks" DROP CONSTRAINT "LegitChecks_certificate_id_fkey";

-- DropForeignKey
ALTER TABLE "LegitChecks" DROP CONSTRAINT "LegitChecks_cover_id_fkey";

-- DropTable
DROP TABLE "LegitCheckImages";

-- DropTable
DROP TABLE "LegitChecks";

-- CreateTable
CREATE TABLE "legit_checks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brand_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "check_status" "LegitCheckStatus" NOT NULL,
    "product_name" TEXT,
    "legit_status" "LegitStatus",
    "client_note" TEXT,
    "admin_note" TEXT,
    "cover_id" UUID,
    "certificate_id" UUID,

    CONSTRAINT "legit_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legit_check_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN,
    "name" TEXT NOT NULL,
    "legit_check_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,

    CONSTRAINT "legit_check_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_cover_id_fkey" FOREIGN KEY ("cover_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "legit_checks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "legit_check_images" DROP CONSTRAINT "legit_check_images_file_id_fkey";

-- DropForeignKey
ALTER TABLE "legit_check_images" DROP CONSTRAINT "legit_check_images_legit_check_id_fkey";

-- DropForeignKey
ALTER TABLE "legit_checks" DROP CONSTRAINT "legit_checks_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "legit_checks" DROP CONSTRAINT "legit_checks_category_id_fkey";

-- DropForeignKey
ALTER TABLE "legit_checks" DROP CONSTRAINT "legit_checks_subcategory_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_legit_check_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_service_id_fkey";

-- DropForeignKey
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "subcategory_instructions" DROP CONSTRAINT "subcategory_instructions_subcategory_id_fkey";

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_instructions" ADD CONSTRAINT "subcategory_instructions_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "legit_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "legit_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

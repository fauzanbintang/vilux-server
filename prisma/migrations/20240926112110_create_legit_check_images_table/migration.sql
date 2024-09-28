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
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "legit_checks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legit_check_images" ADD CONSTRAINT "legit_check_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

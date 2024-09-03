-- CreateTable
CREATE TABLE "category_instructions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,

    CONSTRAINT "category_instructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "category_instructions" ADD CONSTRAINT "category_instructions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_instructions" ADD CONSTRAINT "category_instructions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

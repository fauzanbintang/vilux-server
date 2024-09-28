-- CreateTable
CREATE TABLE "subcategory_instructions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "subcategory_id" UUID NOT NULL,
    "file_id" UUID,

    CONSTRAINT "subcategory_instructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subcategory_instructions" ADD CONSTRAINT "subcategory_instructions_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory_instructions" ADD CONSTRAINT "subcategory_instructions_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

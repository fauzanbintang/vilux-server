-- CreateTable
CREATE TABLE "subcategories" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "instructions" TEXT,
    "file_id" UUID,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

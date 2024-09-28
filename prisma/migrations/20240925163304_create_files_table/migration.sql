-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

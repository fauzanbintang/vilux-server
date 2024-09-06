-- CreateTable
CREATE TABLE "LegitCheckImages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN,
    "name" TEXT NOT NULL,
    "legit_check_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,

    CONSTRAINT "LegitCheckImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LegitCheckImages" ADD CONSTRAINT "LegitCheckImages_legit_check_id_fkey" FOREIGN KEY ("legit_check_id") REFERENCES "LegitChecks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegitCheckImages" ADD CONSTRAINT "LegitCheckImages_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

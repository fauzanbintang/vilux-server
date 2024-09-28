-- CreateEnum
CREATE TYPE "ServicesName" AS ENUM ('fast_checking', 'normal_checking');

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" "ServicesName" NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledgers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "is_credit" BOOLEAN NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "sum_from" BIGINT NOT NULL,
    "sum_to" BIGINT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "referece_type" TEXT NOT NULL,

    CONSTRAINT "ledgers_pkey" PRIMARY KEY ("id")
);

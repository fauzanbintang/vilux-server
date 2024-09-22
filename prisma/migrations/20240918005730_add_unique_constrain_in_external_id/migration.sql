/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_external_id_key" ON "payments"("external_id");

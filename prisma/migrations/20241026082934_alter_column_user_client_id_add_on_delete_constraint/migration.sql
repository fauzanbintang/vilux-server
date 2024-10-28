-- DropForeignKey
ALTER TABLE "fcm_token" DROP CONSTRAINT "fcm_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "legit_checks" DROP CONSTRAINT "legit_checks_client_id_fkey";

-- AlterTable
ALTER TABLE "legit_checks" ALTER COLUMN "client_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "legit_checks" ADD CONSTRAINT "legit_checks_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fcm_token" ADD CONSTRAINT "fcm_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

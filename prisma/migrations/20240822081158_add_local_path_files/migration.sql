/*
  Warnings:

  - Added the required column `local_path` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "local_path" TEXT NOT NULL;

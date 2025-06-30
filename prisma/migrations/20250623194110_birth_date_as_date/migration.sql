/*
  Warnings:

  - Made the column `birth_date` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birth_date" SET NOT NULL,
ALTER COLUMN "birth_date" SET DATA TYPE DATE;

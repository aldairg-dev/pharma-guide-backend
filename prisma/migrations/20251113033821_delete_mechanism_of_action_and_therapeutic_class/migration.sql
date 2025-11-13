/*
  Warnings:

  - You are about to drop the column `mechanism_of_action` on the `Drug` table. All the data in the column will be lost.
  - You are about to drop the column `therapeutic_class` on the `Drug` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Drug" DROP COLUMN "mechanism_of_action",
DROP COLUMN "therapeutic_class";

/*
  Warnings:

  - You are about to drop the `ManagementIa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeIa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ManagementIa" DROP CONSTRAINT "ManagementIa_typeIAId_fkey";

-- DropTable
DROP TABLE "public"."ManagementIa";

-- DropTable
DROP TABLE "public"."TypeIa";

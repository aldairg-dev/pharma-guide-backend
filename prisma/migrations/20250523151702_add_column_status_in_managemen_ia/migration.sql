/*
  Warnings:

  - Added the required column `status` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagementIa" ADD COLUMN     "status" VARCHAR(100) NOT NULL;

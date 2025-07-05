/*
  Warnings:

  - Added the required column `type` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagementIa" ADD COLUMN     "type" VARCHAR(50) NOT NULL;

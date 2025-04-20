/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `StudyPlan` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- AlterTable
ALTER TABLE "StudyPlan" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "statusId";

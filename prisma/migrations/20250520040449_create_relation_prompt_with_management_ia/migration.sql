/*
  Warnings:

  - Added the required column `promptId` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagementIa" ADD COLUMN     "promptId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ManagementIa" ADD CONSTRAINT "ManagementIa_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

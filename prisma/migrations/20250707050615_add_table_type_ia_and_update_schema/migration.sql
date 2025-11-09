/*
  Warnings:

  - You are about to drop the column `status` on the `ManagementIa` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ManagementIa` table. All the data in the column will be lost.
  - Added the required column `typeIAId` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagementIa" DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "typeIAId" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "provider" SET DATA TYPE TEXT,
ALTER COLUMN "model" SET DATA TYPE TEXT,
ALTER COLUMN "version" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TypeIA" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "managementIaId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypeIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeIA_name_key" ON "TypeIA"("name");

-- AddForeignKey
ALTER TABLE "ManagementIa" ADD CONSTRAINT "ManagementIa_typeIAId_fkey" FOREIGN KEY ("typeIAId") REFERENCES "TypeIA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

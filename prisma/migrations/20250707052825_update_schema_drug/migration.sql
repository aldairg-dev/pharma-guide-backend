/*
  Warnings:

  - You are about to drop the `TypeIA` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `therapeutic_class` on table `Drug` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tags` on table `Drug` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ManagementIa" DROP CONSTRAINT "ManagementIa_typeIAId_fkey";

-- AlterTable
ALTER TABLE "Drug" ALTER COLUMN "therapeutic_class" SET NOT NULL,
ALTER COLUMN "therapeutic_class" SET DATA TYPE TEXT,
ALTER COLUMN "tags" SET NOT NULL;

-- DropTable
DROP TABLE "TypeIA";

-- CreateTable
CREATE TABLE "TypeIa" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "managementIaId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypeIa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypeIa_name_key" ON "TypeIa"("name");

-- AddForeignKey
ALTER TABLE "ManagementIa" ADD CONSTRAINT "ManagementIa_typeIAId_fkey" FOREIGN KEY ("typeIAId") REFERENCES "TypeIa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

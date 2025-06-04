/*
  Warnings:

  - You are about to drop the column `base_url` on the `ManagementIa` table. All the data in the column will be lost.
  - You are about to drop the column `promptId` on the `ManagementIa` table. All the data in the column will be lost.
  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,model,version]` on the table `ManagementIa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prompt_description` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_api` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ManagementIa" DROP CONSTRAINT "ManagementIa_promptId_fkey";

-- AlterTable
ALTER TABLE "ManagementIa" DROP COLUMN "base_url",
DROP COLUMN "promptId",
ADD COLUMN     "prompt_description" TEXT NOT NULL,
ADD COLUMN     "url_api" TEXT NOT NULL,
ADD COLUMN     "version" VARCHAR(50);

-- DropTable
DROP TABLE "Prompt";

-- CreateIndex
CREATE UNIQUE INDEX "ManagementIa_provider_model_version_key" ON "ManagementIa"("provider", "model", "version");

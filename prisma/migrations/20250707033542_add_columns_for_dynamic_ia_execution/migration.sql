/*
  Warnings:

  - Added the required column `body_template` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headers_template` to the `ManagementIa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ManagementIa" ADD COLUMN     "body_template" JSONB NOT NULL,
ADD COLUMN     "headers_template" JSONB NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL DEFAULT 'POST',
ADD COLUMN     "output_type" VARCHAR(50),
ADD COLUMN     "response_path" TEXT NOT NULL DEFAULT 'result';

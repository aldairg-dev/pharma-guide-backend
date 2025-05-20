-- CreateTable
CREATE TABLE "ManagementIa" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "api_key" TEXT NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "base_url" VARCHAR(255) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagementIa_pkey" PRIMARY KEY ("id")
);

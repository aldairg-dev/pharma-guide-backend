-- CreateTable
CREATE TABLE "Prompt" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "prompt" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

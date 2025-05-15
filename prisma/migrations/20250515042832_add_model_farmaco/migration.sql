-- CreateTable
CREATE TABLE "Farmaco" (
    "id" SERIAL NOT NULL,
    "name_generic" VARCHAR(100) NOT NULL,
    "brand_name" VARCHAR(100) NOT NULL,
    "mechanism_of_action" VARCHAR(255) NOT NULL,
    "therapeutic_class" VARCHAR(100),
    "tags" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farmaco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farmaco" ADD CONSTRAINT "Farmaco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

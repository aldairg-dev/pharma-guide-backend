import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("pharmaGuide", 10);

  await prisma.user.create({
    data: {
      full_name: "Test pharmaGuide",
      email: "test@pharma.guide",
      password: hashedPassword,
    },
  });

  console.log("Seed de usuario registrado con exito!");
}

main()
  .catch((e) => {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

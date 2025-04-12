import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // -> Crear un nuevo status
    const existingStatus = await prisma.status.findUnique({
      where: { name: "active" },
    });

    if (!existingStatus) {
      await prisma.status.create({
        data: {
          name: "active",
        },
      });
      console.log("Seed de status registrado con éxito!");
    } else {
      console.log("El status ya existe.");
    }

    // -> Crear un nuevo rol
    const existingRole = await prisma.role.findUnique({
      where: { name: "admin" },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: {
          name: "admin",
          statusId: 1,
        },
      });
      console.log("Seed de rol registrado con éxito!");
    } else {
      console.log("El rol ya existe.");
    }

    // -> Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash("pharmaGuide", 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: "test@pharma.guide" },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          full_name: "Test pharmaGuide",
          email: "test@pharma.guide",
          password: hashedPassword,
          roleId: 1,
          statusId: 1,
        },
      });
      console.log("Seed de usuario registrado con éxito!");
    } else {
      console.log("El usuario ya existe.");
    }
  } catch (e) {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

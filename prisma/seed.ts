import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // -> Crear un nuevo status
    const statuses = ["active", "deleted"];

    for (const name of statuses) {
      const existingStatus = await prisma.status.findUnique({
        where: { name },
      });

      if (!existingStatus) {
        await prisma.status.create({
          data: { name },
        });
        console.log(`Status '${name}' registered successfully.`);
      } else {
        console.log(`Status '${name}' already exists.`);
      }
    }

    async function createRoleIfNotExists(roleName: string, statusId: number) {
      const existingRole = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: {
            name: roleName,
            statusId: statusId,
          },
        });
        console.log(`Rol '${roleName}' registrado con éxito!`);
      } else {
        console.log(`El rol '${roleName}' ya existe.`);
      }
    }

    await createRoleIfNotExists("admin", 1);
    await createRoleIfNotExists("client", 1);

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
          isDeleted: false,
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

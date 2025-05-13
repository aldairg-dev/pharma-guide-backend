import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    async function createRoleIfNotExists(roleName: string) {
      const existingRole = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: {
            name: roleName,
            isDeleted: false,
          },
        });
        console.log(`Rol '${roleName}' registrado con éxito!`);
      } else {
        console.log(`El rol '${roleName}' ya existe.`);
      }
    }

    await createRoleIfNotExists("admin");
    await createRoleIfNotExists("client");

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

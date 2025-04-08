import { PrismaClient, User } from "@prisma/client";
import { bcryptService } from "../../../utils/bcryp/bcryp.service";

const prisma = new PrismaClient();

export class UserService {
  async createUser(user: User): Promise<User | null> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { email: user.email },
      });

      if (existingUser) {
        console.warn(`Usuario con email ${user.email} ya existe`);
        return null;
      }

      const newUser = await prisma.user.create({
        data: user,
      });

      return newUser;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("No se pudo crear el usuario");
    }
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcryptService.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("No se pudo iniciar sesión");
    }
  }

  async existUser(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
      });

      return user;
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      throw new Error("No se pudo verificar el usuario");
    }
  }
}

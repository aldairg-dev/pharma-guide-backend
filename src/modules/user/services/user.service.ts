import { PrismaClient, User } from "@prisma/client";
import { bcryptService } from "../../../utils/bcryp/bcryp.service";
import { JwtService } from "../../../utils/jwt/jwt.service";

const prisma = new PrismaClient();
const jwtService = new JwtService();

export class UserService {
  async createUser(user: User): Promise<User | null> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: user.email,
          isDeleted: false,
        },
      });

      if (existingUser) {
        console.warn(`A user with the email ${user.email} already exists.`);
        return null;
      }

      const hashedPassword = await bcryptService.encryptPassword(user.password);
      user.password = hashedPassword;

      const newUser = await prisma.user.create({
        data: user,
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user.");
    }
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
          isDeleted: false,
        },
      });

      if (!user) {
        console.warn("User not found or has been deleted.");
        return null;
      }

      const isPasswordValid = await bcryptService.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        console.warn("Invalid password.");
        return null;
      }

      const token = jwtService.createToken({
        emailUser: user.email ?? "",
        userId: user.id ?? null,
      });

      return token;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Failed to log in.");
    }
  }

  async existUser(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
          isDeleted: false,
        },
      });

      return user;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Failed to verify user.");
    }
  }

  async deleteUser(idUser: number): Promise<User | null> {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: idUser,
          isDeleted: false,
        },
      });

      if (!userData || userData.isDeleted) {
        throw new Error("User not found or already deleted.");
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          isDeleted: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("An error occurred while deleting the user.");
    }
  }
}

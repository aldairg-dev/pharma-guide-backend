import { PrismaClient, User } from "@prisma/client";
import { bcryptService } from "../../../utils/bcryp/bcryp.service";
import { JwtService } from "../../../utils/jwt/jwt.service";
import { randomUUID } from "node:crypto";
import { RoleService } from "../../role/service/role.service";
import { parse } from "date-fns";

const prisma = new PrismaClient();
const jwtService = new JwtService();
const roleService = new RoleService();

export class AccessService {
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

      if (!user.password) {
        const randomPassword = randomUUID().slice(0, 10);
        user.password = await bcryptService.encryptPassword(randomPassword);
      } else {
        user.password = await bcryptService.encryptPassword(user.password);
      }

      if (!user.roleId) {
        const roleClient = await roleService.getRoleClient();
        if (roleClient?.id) {
          user.roleId = Number(roleClient.id);
        } else {
          throw new Error("Role not found");
        }
      }

      if (typeof user.birth_date === "string") {
        user.birth_date = parse(user.birth_date, "dd/MM/yyyy", new Date());
      }

      const newUser = await prisma.user.create({
        data: user,
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to create user: ${errorMessage}`);
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{
    token: string;
    full_name: string | null;
    userId: number | null;
  } | null> {
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
        roleId: user.roleId ?? 2,
      });

      return {
        token,
        full_name: user.full_name ?? "",
        userId: user.id ?? null,
      };
    } catch (error) {
      // console.error("Login error:", error);
      throw new Error("Failed to log in.");
    }
  }

  async existUser(email: string): Promise<User | null> {
    try {
      return await prisma.user.findFirst({
        where: {
          email,
          isDeleted: false,
        },
      });
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Failed to verify user.");
    }
  }

  async deleteUser(idUser: number): Promise<User | null> {
    try {
      const userData = await prisma.user.findUnique({
        where: { id: idUser },
      });

      if (!userData || userData.isDeleted) {
        throw new Error("User not found or already deleted.");
      }

      return await prisma.user.update({
        where: { id: idUser },
        data: { isDeleted: true },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("An error occurred while deleting the user.");
    }
  }
}

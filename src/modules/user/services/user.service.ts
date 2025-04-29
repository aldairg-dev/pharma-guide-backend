import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

export class UserService {
  async getUser(): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("An error occurred while fetching users.");
    }
  }

  async getUserById(idUser: number): Promise<User | null> {
    try {
      return await prisma.user.findFirst({
        where: { id: idUser, isDeleted: false },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  }

  async updateUser(user: User): Promise<User | null> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { id: user.id, isDeleted: false },
      });

      if (!existingUser) {
        throw new Error("User not found or already deleted.");
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: user,
      });

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("An error occurred while updating the user.");
    }
  }

  async deleteUser(idUser: number): Promise<User | null> {
    try {
      const userData = await prisma.user.findFirst({
        where: { id: idUser, isDeleted: false },
      });

      if (!userData) {
        throw new Error("User not found or already deleted.");
      }

      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: { isDeleted: true },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("An error occurred while deleting the user.");
    }
  }
}

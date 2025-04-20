import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
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

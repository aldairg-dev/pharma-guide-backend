import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export class StatusService {
  async createStatus(status: Status): Promise<Status | null> {
    try {
      const existingStatus = await prisma.status.findFirst({
        where: { name: status.name },
      });

      if (existingStatus) {
        throw new Error("The status already exists.");
      }

      const newStatus = await prisma.status.create({
        data: status,
      });

      return newStatus;
    } catch (error) {
      console.error("Failed to create status:", error);
      throw new Error("Unable to create new status.");
    }
  }
}

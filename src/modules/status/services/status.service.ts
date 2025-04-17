import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export class StatusService {
  async createStatus(status: Status): Promise<Status | null> {
    try {
      const existingStatus = await prisma.status.findFirst({
        where: {
          name: status.name,
          isDeleted: false,
        },
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
  async getStatus() {
    try {
      const dataStatus = await prisma.status.findMany({
        where: {
          isDeleted: false,
        },
      });

      if (dataStatus.length === 0) {
        console.log("No status records found.");
      }

      return dataStatus;
    } catch (error) {
      console.error(
        "An error occurred while retrieving status records:",
        error
      );
      throw new Error("Unable to retrieve status records.");
    }
  }
}

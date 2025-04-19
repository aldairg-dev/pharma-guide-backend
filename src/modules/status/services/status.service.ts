import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export class StatusService {
  async createStatus(status: Status): Promise<Status> {
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

  async getStatus(): Promise<Status[]> {
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

  async getOneStatus(idStatus: number): Promise<Status> {
    try {
      if (typeof idStatus !== "number" || idStatus <= 0) {
        throw new Error("Invalid or missing status ID.");
      }

      const dataStatus = await prisma.status.findUnique({
        where: {
          id: idStatus,
          isDeleted: false,
        },
      });

      if (!dataStatus) {
        throw new Error(`Status with ID ${idStatus} not found.`);
      }

      return dataStatus;
    } catch (error) {
      console.error("Error retrieving status:", error);
      throw new Error("Unable to retrieve the status.");
    }
  }

  async updateStatus(status: Status): Promise<Status | null> {
    try {
      const existingStatus = await prisma.status.findFirst({
        where: {
          id: status.id,
          isDeleted: false,
        },
      });

      if (!existingStatus) {
        console.warn(
          `Status with ID ${status.id} not found or already deleted.`
        );
        return null;
      }

      const updatedStatus = await prisma.status.update({
        where: { id: status.id },
        data: status,
      });

      return updatedStatus;
    } catch (error) {
      console.error("Error updating status:", error);
      throw new Error("Unable to update status.");
    }
  }
}

import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class StatusService {
  private async findStatusById(id: number): Promise<Status | null> {
    return prisma.status.findUnique({
      where: { id },
    });
  }

  private async findStatusByName(name: string): Promise<Status | null> {
    return prisma.status.findFirst({
      where: {
        name,
        isDeleted: false,
      },
    });
  }

  async createStatus(status: Status): Promise<Status> {
    const existingStatus = await this.findStatusByName(status.name);
    if (existingStatus) {
      throw new BadRequestError("The status already exists.");
    }

    return prisma.status.create({
      data: status,
    });
  }

  async getStatus(): Promise<Status[]> {
    const statuses = await prisma.status.findMany({
      where: { isDeleted: false }, // Filtering only non-deleted statuses
    });

    if (statuses.length === 0) {
      throw new NotFoundError("No status records found.");
    }

    return statuses;
  }

  async getOneStatus(idStatus: number): Promise<Status> {
    if (idStatus <= 0) {
      throw new BadRequestError("Invalid or missing status ID.");
    }

    const status = await this.findStatusById(idStatus);

    if (!status || status.isDeleted) {
      throw new NotFoundError(
        `Status with ID ${idStatus} not found or deleted.`
      );
    }

    return status;
  }

  async updateStatus(status: Status): Promise<Status> {
    const existingStatus = await this.findStatusById(status.id);

    if (!existingStatus) {
      throw new NotFoundError(
        `Status with ID ${status.id} not found or already deleted.`
      );
    }

    return prisma.status.update({
      where: { id: status.id },
      data: status,
    });
  }

  async deleteStatus(idStatus: number): Promise<Status> {
    if (idStatus <= 0) {
      throw new BadRequestError("Invalid or missing status ID.");
    }

    const status = await this.findStatusById(idStatus);

    if (!status || status.isDeleted) {
      throw new NotFoundError("Status not found or already deleted.");
    }

    return prisma.status.update({
      where: { id: idStatus },
      data: { isDeleted: true },
    });
  }

  private async getStatusByName(name: string): Promise<Status> {
    const status = await this.findStatusByName(name);

    if (!status) {
      throw new NotFoundError(
        `The '${name}' status was not found or is marked as deleted.`
      );
    }

    return status;
  }

  async getActive(): Promise<Status> {
    return this.getStatusByName("active");
  }

  async getDelete(): Promise<Status> {
    return this.getStatusByName("deleted");
  }
}

import { ManagementIa, PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export class IaManagementService {
  public async createManagement(
    managementIa: ManagementIa
  ): Promise<ManagementIa> {
    try {
      const existingManagement = await prisma.managementIa.findFirst({
        where: {
          name: managementIa.name,
          provider: managementIa.provider,
          model: managementIa.model,
        },
      });

      if (existingManagement) {
        throw new Error("The management already exists.");
      }

      const newManagement = await prisma.managementIa.create({
        data: managementIa,
      });

      return newManagement;
    } catch (error: any) {
      console.error("Error creating management IA:", error?.message);
      throw new Error("Error creating new management IA");
    }
  }
}

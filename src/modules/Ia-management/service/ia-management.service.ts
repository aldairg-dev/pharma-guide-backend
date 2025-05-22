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

  public async getManagement(): Promise<ManagementIa[]> {
    try {
      const managementList = await prisma.managementIa.findMany();

      return managementList;
    } catch (error: any) {
      console.error("Error fetching management IA:", error?.message);
      throw new Error("Error fetching management IA");
    }
  }

  public async getOneMaganegement(
    manegementId: number
  ): Promise<ManagementIa | null> {
    try {
      return await prisma.managementIa.findFirst({
        where: {
          id: manegementId,
        },
      });
    } catch (error: any) {
      console.error("Errro fetching the manegement IA :", error?.message);
      throw new Error("Error fetching the management IA");
    }
  }

  public async updateManegement(
    managementId: number,
    management: ManagementIa
  ): Promise<ManagementIa> {
    try {
      const updatedManagement = await prisma.managementIa.update({
        where: { id: managementId },
        data: management,
      });
      return updatedManagement;
    } catch (error: any) {
      console.error("Error updating the management IA:", error?.message);
      throw new Error("Error updating the management IA");
    }
  }
}

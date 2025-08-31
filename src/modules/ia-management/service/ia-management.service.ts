import { ManagementIa, PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export class IaManagementService {
  async createManagement(
    managementIa: ManagementIa,
    type: number
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
        data: {
          name: managementIa.name,
          provider: managementIa.provider,
          api_key: managementIa.api_key,
          model: managementIa.model,
          version: managementIa.version,
          url_api: managementIa.url_api,
          method: managementIa.method,
          headers_template: managementIa.headers_template as any,
          body_template: managementIa.body_template as any,
          prompt_description: managementIa.prompt_description,
          isDeleted: managementIa.isDeleted,
          typeIAId: type,
        },
      });

      return newManagement;
    } catch (error: any) {
      console.error("Error creating management IA:", error?.message);
      throw new Error("Error creating new management IA");
    }
  }

  async getManagement(): Promise<ManagementIa[]> {
    try {
      const managementList = await prisma.managementIa.findMany();

      return managementList;
    } catch (error: any) {
      console.error("Error fetching management IA:", error?.message);
      throw new Error("Error fetching management IA");
    }
  }

  async getManagementType(type: number): Promise<ManagementIa | null> {
    try {
      return await prisma.managementIa.findFirst({
        where: {
          typeIAId: type,
          isDeleted: false,
        },
        select: {
          id: true,
          typeIAId: true,
          name: true,
          provider: true,
          api_key: true,
          model: true,
          version: true,
          url_api: true,
          method: true,
          headers_template: true,
          body_template: true,
          prompt_description: true,
          response_path: true,
          output_type: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: any) {
      console.error("Error fetching management IA by type:", error?.message);
      throw new Error("Error fetching management IA by type");
    }
  }

  async getOneMaganegement(manegementId: number): Promise<ManagementIa | null> {
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

  async updateManegement(
    managementId: number,
    management: ManagementIa
  ): Promise<ManagementIa> {
    try {
      const existingActiveManagement = await prisma.managementIa.findFirst({
        where: {
          isDeleted: false,
        },
      });
      if (management.isDeleted === true && existingActiveManagement !== null) {
        throw new Error(
          "A management record is already active. Only one active management is allowed at a time."
        );
      } else {
        const { id, createdAt, updatedAt, ...updateData } = management;
        const updatedManagement = await prisma.managementIa.update({
          where: { id: managementId },
          data: {
            ...updateData,
            headers_template: updateData.headers_template as any,
            body_template: updateData.body_template as any,
          },
        });
        return updatedManagement;
      }
    } catch (error: any) {
      console.error("Error updating the management IA:", error?.message);
      throw new Error("Error updating the management IA");
    }
  }

  async deleteManegement(managementId: number): Promise<ManagementIa | null> {
    try {
      const deletedManagement = await prisma.managementIa.update({
        where: { id: managementId },
        data: {
          isDeleted: true,
        },
      });
      return deletedManagement;
    } catch (error: any) {
      console.error("Error deleting the management IA:", error?.message);
      return null;
    }
  }
}

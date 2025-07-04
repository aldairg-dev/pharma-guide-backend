import { Drug, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class DrugService {
  async createDrug(
    data: Omit<Drug, "id" | "createdAt" | "updatedAt">
  ): Promise<Drug> {
    try {
      const existingDrug = await prisma.drug.findFirst({
        where: {
          userId: data.userId,
          name_generic: data.name_generic,
          isDeleted: false,
        },
      });

      if (existingDrug) {
        throw new Error("The drug already exists.");
      }

      const newDrug = await prisma.drug.create({ data });
      return newDrug;
    } catch (error: any) {
      console.error("Error creating drug:", error.message);
      throw new Error(
        `An error occurred while creating the drug. ${error?.message ?? ""}`
      );
    }
  }

  async getDrugs(): Promise<Drug[]> {
    try {
      return await prisma.drug.findMany({
        include: { user: true },
      });
    } catch (error: any) {
      console.error("Error fetching drugs:", error.message);
      throw new Error("An error occurred while fetching drugs.");
    }
  }

  async getDrugsByUser(userId: number): Promise<Drug[]> {
    try {
      if (!userId) {
        throw new Error("User ID is required.");
      }
      return await prisma.drug.findMany({
        where: {
          userId,
          isDeleted: false,
        },
      });
    } catch (error: any) {
      console.error("Error fetching drugs for user:", error.message);
      throw new Error("An error occurred while fetching drugs for the user.");
    }
  }

  async updateDrug(drug: Drug, drugId: number): Promise<Drug | null> {
    try {
      const drugOld = await prisma.drug.findFirst({
        where: { id: drugId, isDeleted: false },
      });

      if (!drugOld) {
        throw new Error("Drug not found.");
      }

      const drugUpdate = await prisma.drug.update({
        where: {
          id: drugId,
        },
        data: drug,
      });

      return drugUpdate;
    } catch (error: any) {
      console.error("Error updating drug: ", error.message);
      throw new Error("An error occurred while updating the drug.");
    }
  }

  async deleteDrug(drugId: number): Promise<Drug | null> {
    try {
      const drug = await prisma.drug.findFirst({
        where: {
          id: drugId,
          isDeleted: false,
        },
      });

      if (!drug) {
        throw new Error("Drug not found.");
      }

      const drugDelete = await prisma.drug.update({
        where: {
          id: drugId,
        },
        data: {
          isDeleted: true,
        },
      });

      return drugDelete;
    } catch (error: any) {
      console.error("Error deleting drug: ", error.message);
      throw new Error("An error occurred while deleting the drug.");
    }
  }
}

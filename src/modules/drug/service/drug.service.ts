import { Drug, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

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

  // Método original - mantener para compatibilidad con rutas admin
  async getDrugById(drugId: number): Promise<{
    id: number;
    userId: number;
    name_generic: string;
    brand_name: string;
    tags: string;
  } | null> {
    try {
      if (!drugId || typeof drugId !== "number") {
        throw new Error("Invalid Drug ID.");
      }

      const drug = await prisma.drug.findUnique({
        where: {
          id: drugId,
        },
        select: {
          id: true,
          userId: true,
          name_generic: true,
          brand_name: true,
          tags: true,
        },
      });

      if (!drug) {
        return null;
      }

      return drug;
    } catch (error: any) {
      console.error(`Error fetching drug with ID ${drugId}:`, error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw new Error(`Failed to retrieve drug data: ${error.message}`);
    }
  }

  // Nuevo método con validación de ownership
  async getMyDrugById(userId: number, drugId: number): Promise<{
    id: number;
    userId: number;
    name_generic: string;
    brand_name: string;
    tags: string;
  } | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }
      
      if (!drugId || typeof drugId !== "number") {
        throw new Error("Invalid Drug ID.");
      }

      const drug = await prisma.drug.findUnique({
        where: {
          id: drugId,
          userId: userId, // Validación directa en la consulta
          isDeleted: false,
        },
        select: {
          id: true,
          userId: true,
          name_generic: true,
          brand_name: true,
          tags: true,
        },
      });

      return drug; // Retorna null si no encuentra o no pertenece al usuario
    } catch (error: any) {
      console.error(`Error fetching drug with ID ${drugId} for user ${userId}:`, error);
      throw new Error(`Failed to retrieve drug data: ${error.message}`);
    }
  }

  async getMyDrugs(userId: number): Promise<Drug[]> {
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

  // Método original - mantener para compatibilidad
  async updateMyDrug(drug: Drug, drugId: number): Promise<Drug | null> {
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

  // Nuevo método con validación de ownership
  async updateMyDrugById(userId: number, drug: Drug, drugId: number): Promise<Drug | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }
      
      if (!drugId || typeof drugId !== "number") {
        throw new Error("Invalid Drug ID.");
      }

      // Buscar y validar ownership en una sola consulta
      const drugOld = await prisma.drug.findFirst({
        where: { 
          id: drugId, 
          userId: userId, // Validación de ownership
          isDeleted: false 
        },
      });

      if (!drugOld) {
        return null; // No encontrado o no pertenece al usuario
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

  // Método original - mantener para compatibilidad
  async deleteMyDrug(drugId: number): Promise<Drug | null> {
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

  // Nuevo método con validación de ownership
  async deleteMyDrugById(userId: number, drugId: number): Promise<Drug | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }
      
      if (!drugId || typeof drugId !== "number") {
        throw new Error("Invalid Drug ID.");
      }

      // Buscar y validar ownership en una sola consulta
      const drug = await prisma.drug.findFirst({
        where: {
          id: drugId,
          userId: userId, // Validación de ownership
          isDeleted: false,
        },
      });

      if (!drug) {
        return null; // No encontrado o no pertenece al usuario
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

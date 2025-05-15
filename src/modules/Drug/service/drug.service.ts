import { Drug, PrismaClient } from "@prisma/client/default";
import { empty } from "@prisma/client/runtime/library";
const prisma = new PrismaClient();

export class DrugService {
  async getDrugs() {
    try {
      const drugs = await prisma.drug.findMany({});
      return drugs;
    } catch (error: any) {
      console.error("Error fetching drugs: ", error.message);
      throw new Error("An error occurred while fetching drugs.");
    }
  }

  async createDrug(drug: Drug) {
    try {
      const existingDrug = await prisma.drug.findFirst({
        where: {
          userId: drug.userId,
          isDeleted: false,
        },
      });

      if (existingDrug) {
        throw new Error("The drug already exists.");
      } else {
        const newDrug = await prisma.drug.create({
          data: drug,
        });
        return newDrug;
      }
    } catch (error: any) {
      console.error("Error creating drug: ", error.message);
      throw new Error("An error occurred while creating the drug.");
    }
  }

  async findDrugToUser(userId: number) {
    try {
      if (!userId) {
        throw new Error("User ID is required.");
      }

      const drugsUser = await prisma.drug.findMany({
        where: {
          userId: userId,
          isDeleted: false,
        },
      });
      return drugsUser;
    } catch (error: any) {
      console.error("Error fetching drugs for user: ", error.message);
      throw new Error("An error occurred while fetching drugs for the user.");
    }
  }
}

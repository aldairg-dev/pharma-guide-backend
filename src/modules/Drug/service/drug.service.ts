import { PrismaClient } from "@prisma/client/default";
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
}

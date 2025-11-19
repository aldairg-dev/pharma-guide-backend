import { PrismaClient, StudyPlan } from "@prisma/client";

const prisma = new PrismaClient();

export class StudyPlanService {
  async createMyStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan> {
    try {
      const existingStudyPlan = await prisma.studyPlan.findFirst({
        where: {
          subjet_name: studyPlan.subjet_name,
          isDeleted: true,
        },
      });

      if (existingStudyPlan) {
        throw new Error("The study plan already exists.");
      }

      const newStudyPlan = await prisma.studyPlan.create({
        data: {
          ...studyPlan,
          isDeleted: false,
        },
      });

      return newStudyPlan;
    } catch (error: any) {
      console.error("Error creating the study plan:", error);
      throw new Error(`Failed to create the study plan: ${error.message}`);
    }
  }

  async getMyStudyPlans(userId?: number): Promise<StudyPlan[] | null> {
    try {
      const where = {
        ...(userId ? { userId } : {}),
        isDeleted: false,
      };

      const studyPlans = await prisma.studyPlan.findMany({
        where,
        include: {
          user: true,
        },
      });

      return studyPlans.length > 0 ? studyPlans : null;
    } catch (error: any) {
      console.error("Error fetching study plans:", error);
      throw new Error(`Failed to fetch study plans: ${error.message}`);
    }
  }

  async getMyStudyPlanById(
    userId: number,
    studyPlanId: number
  ): Promise<StudyPlan | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }

      if (!studyPlanId || typeof studyPlanId !== "number") {
        throw new Error("Invalid Study Plan ID.");
      }

      const studyPlan = await prisma.studyPlan.findFirst({
        where: {
          id: studyPlanId,
          userId: userId, // Validación directa en la consulta
          isDeleted: false,
        },
        include: {
          user: true,
        },
      });

      return studyPlan; // Retorna null si no encuentra o no pertenece al usuario
    } catch (error: any) {
      console.error(
        `Error fetching study plan with ID ${studyPlanId} for user ${userId}:`,
        error
      );
      throw new Error(`Failed to retrieve study plan: ${error.message}`);
    }
  }

  async updateMyStudyPlanById(
    userId: number,
    studyPlan: StudyPlan,
    studyPlanId: number
  ): Promise<StudyPlan | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }

      if (!studyPlanId || typeof studyPlanId !== "number") {
        throw new Error("Invalid Study Plan ID.");
      }

      // Buscar y validar ownership en una sola consulta
      const existingPlan = await prisma.studyPlan.findFirst({
        where: {
          id: studyPlanId,
          userId: userId, // Validación de ownership
          isDeleted: false,
        },
      });

      if (!existingPlan) {
        return null; // No encontrado o no pertenece al usuario
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: studyPlanId },
        data: studyPlan,
      });

      return updatedStudyPlan;
    } catch (error: any) {
      console.error("Failed to update study plan:", error);
      throw new Error(`Unable to update the study plan: ${error.message}`);
    }
  }

  async deleteMyStudyPlanById(
    userId: number,
    studyPlanId: number
  ): Promise<StudyPlan | null> {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid User ID.");
      }

      if (!studyPlanId || typeof studyPlanId !== "number") {
        throw new Error("Invalid Study Plan ID.");
      }

      // Buscar y validar ownership en una sola consulta
      const existingPlan = await prisma.studyPlan.findFirst({
        where: {
          id: studyPlanId,
          userId: userId, // Validación de ownership
          isDeleted: false,
        },
      });

      if (!existingPlan) {
        return null; // No encontrado o no pertenece al usuario
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: studyPlanId },
        data: { isDeleted: true },
      });

      return updatedStudyPlan;
    } catch (error: any) {
      console.error("Error deleting study plan:", error);
      throw new Error(`Unable to delete the study plan: ${error.message}`);
    }
  }

  async getStudyPlans(): Promise<StudyPlan[] | null> {
    try {
      const studyPlans = await prisma.studyPlan.findMany({
        where: {
          isDeleted: false,
        },
      });

      return studyPlans.length > 0 ? studyPlans : null;
    } catch (error: any) {
      console.error("Error fetching study plans:", error);
      throw new Error(`Failed to fetch study plans: ${error.message}`);
    }
  }

  async getStudyPlanById(StudyPlanId: number): Promise<StudyPlan | null> {
    try {
      if (!StudyPlanId || isNaN(StudyPlanId)) {
        throw new Error("Study plan ID is required and must be a number.");
      }

      const studyPlan = await prisma.studyPlan.findFirst({
        where: {
          id: StudyPlanId,
          isDeleted: false,
        },
        include: {
          user: true,
        },
      });

      return studyPlan;
    } catch (error: any) {
      console.error("Failed to get the study plan:", error);
      throw new Error(`Unable to get the study plan: ${error.message}`);
    }
  }
}

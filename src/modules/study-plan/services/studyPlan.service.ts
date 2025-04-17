import { PrismaClient, StudyPlan } from "@prisma/client";
const prisma = new PrismaClient();

export class StudyPlanService {
  async createStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan | null> {
    try {
      const existingStudyPlan = await prisma.studyPlan.findFirst({
        where: { subjet_name: studyPlan.subjet_name },
      });

      if (existingStudyPlan)
        return console.warn("El studyPlan ya existe"), null;

      const newStudyPlan = await prisma.studyPlan.create({
        data: studyPlan,
      });

      return newStudyPlan;
    } catch (error) {
      console.log("Error al crear el study Plan", error);
      throw new Error("No se pudo crear el study Plan");
    }
  }

  async getStudyPlan(userId: number) {
    const studyPlan = await prisma.studyPlan.findMany({
      where: { userId },
    });

    if (!studyPlan || studyPlan.length === 0)
      return console.warn("No existen study plan para este usuario"), null;

    return studyPlan;
  }

  async getOneStudyPlan(idStudyPlan: number) {
    try {
      if (!idStudyPlan) throw new Error("Study plan ID is required.");

      const studyPlan = await prisma.studyPlan.findUnique({
        where: { id: idStudyPlan },
      });

      return studyPlan;
    } catch (error) {
      console.log("Failed to get the study plan:", error);
      throw new Error("Unable to get the study plan. Please try again later.");
    }
  }

  async updateStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan | null> {
    try {
      const existingPlans = await prisma.studyPlan.findMany({
        where: {
          id: studyPlan.id,
        },
      });

      if (existingPlans.length === 0) {
        console.warn(
          "No existing study plan found with the given subject name."
        );
        return null;
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: studyPlan.id },
        data: studyPlan,
      });

      return updatedStudyPlan;
    } catch (error) {
      console.error("Failed to update study plan:", error);
      throw new Error(
        "Unable to update the study plan. Please try again later."
      );
    }
  }
}

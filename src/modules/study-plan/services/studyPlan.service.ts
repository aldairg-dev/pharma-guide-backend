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
}

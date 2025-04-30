import { PrismaClient, StudyPlan } from "@prisma/client";
import { StatusService } from "../../status/services/status.service";
const prisma = new PrismaClient();

export class StudyPlanService {
  async createStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan | null> {
    try {
      const existingStudyPlan = await prisma.studyPlan.findFirst({
        where: {
          subjet_name: studyPlan.subjet_name,
          statusId: 1,
        },
      });

      if (existingStudyPlan) {
        throw new Error("The study plan already exists.");
      }

      const newStudyPlan = await prisma.studyPlan.create({
        data: {
          ...studyPlan,
          statusId: 1,
        },
      });

      return newStudyPlan;
    } catch (error) {
      console.error("Error creating the study plan:", error);
      throw new Error("Failed to create the study plan.");
    }
  }
  async getAllStudyPlan() {
    const studyPlan = await prisma.studyPlan.findMany({
      where: {
        statusId: 1,
      },
      include: {
        Status: true,
        user: true,
      },
    });

    if (!studyPlan || studyPlan.length === 0) {
      console.warn("No existen study plan para este usuario");
      return null;
    }

    return studyPlan;
  }

  async getStudyPlan(userId: number) {
    const studyPlan = await prisma.studyPlan.findMany({
      where: {
        userId,
        statusId: 1,
      },
      include: {
        Status: true,
        user: true,
      },
    });

    if (!studyPlan || studyPlan.length === 0) {
      console.warn("No existen study plan para este usuario");
      return null;
    }

    return studyPlan;
  }

  async getOneStudyPlan(idStudyPlan: number) {
    try {
      if (!idStudyPlan) throw new Error("Study plan ID is required.");

      const studyPlan = await prisma.studyPlan.findFirst({
        where: {
          id: idStudyPlan,
          statusId: 1,
        },
        include: {
          Status: true,
          user: true,
        },
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
          statusId: 1,
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

  async deleteStudyPlan(idStudyPlan: number): Promise<StudyPlan | null> {
    try {
      const statusService = new StatusService();
      const deletedStatus = await statusService.getDelete();

      if (!idStudyPlan) {
        throw new Error("Study plan ID is required.");
      }

      const dataStudyPlan = await prisma.studyPlan.findUnique({
        where: {
          id: idStudyPlan,
        },
      });

      if (!dataStudyPlan) {
        throw new Error("Study plan not found.");
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: {
          id: dataStudyPlan.id,
        },
        data: {
          statusId: deletedStatus.id,
        },
      });

      return updatedStudyPlan;
    } catch (error) {
      console.error("Error deleting study plan:", error);
      throw error;
    }
  }
}

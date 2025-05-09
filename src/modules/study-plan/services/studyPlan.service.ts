import { PrismaClient, StudyPlan } from "@prisma/client";
import { StatusService } from "../../status/services/status.service";

const prisma = new PrismaClient();

export class StudyPlanService {
  private readonly statusService = new StatusService();
  private readonly ACTIVE_STATUS_ID = 1;

  async createStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan> {
    try {
      const existingStudyPlan = await prisma.studyPlan.findFirst({
        where: {
          subjet_name: studyPlan.subjet_name,
          statusId: this.ACTIVE_STATUS_ID,
        },
      });

      if (existingStudyPlan) {
        throw new Error("The study plan already exists.");
      }

      const newStudyPlan = await prisma.studyPlan.create({
        data: {
          ...studyPlan,
          statusId: this.ACTIVE_STATUS_ID,
        },
      });

      return newStudyPlan;
    } catch (error: any) {
      console.error("Error creating the study plan:", error);
      throw new Error(`Failed to create the study plan: ${error.message}`);
    }
  }

  async getStudyPlans(userId?: number): Promise<StudyPlan[] | null> {
    try {
      const where = {
        ...(userId ? { userId } : {}),
        statusId: this.ACTIVE_STATUS_ID,
      };

      const studyPlans = await prisma.studyPlan.findMany({
        where,
        include: {
          Status: true,
          user: true,
        },
      });

      return studyPlans.length > 0 ? studyPlans : null;
    } catch (error: any) {
      console.error("Error fetching study plans:", error);
      throw new Error(`Failed to fetch study plans: ${error.message}`);
    }
  }

  async getOneStudyPlan(idStudyPlan: number): Promise<StudyPlan | null> {
    try {
      if (!idStudyPlan || isNaN(idStudyPlan)) {
        throw new Error("Study plan ID is required and must be a number.");
      }

      const studyPlan = await prisma.studyPlan.findFirst({
        where: {
          id: idStudyPlan,
          statusId: this.ACTIVE_STATUS_ID,
        },
        include: {
          Status: true,
          user: true,
        },
      });

      return studyPlan;
    } catch (error: any) {
      console.error("Failed to get the study plan:", error);
      throw new Error(`Unable to get the study plan: ${error.message}`);
    }
  }

  async updateStudyPlan(studyPlan: StudyPlan): Promise<StudyPlan | null> {
    try {
      if (!studyPlan.id || isNaN(studyPlan.id)) {
        throw new Error("Study plan ID is required and must be a number.");
      }

      const existingPlan = await prisma.studyPlan.findFirst({
        where: {
          id: studyPlan.id,
          statusId: this.ACTIVE_STATUS_ID,
        },
      });

      if (!existingPlan) {
        console.warn("No existing study plan found with the given ID.");
        return null;
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: studyPlan.id },
        data: studyPlan,
      });

      return updatedStudyPlan;
    } catch (error: any) {
      console.error("Failed to update study plan:", error);
      throw new Error(`Unable to update the study plan: ${error.message}`);
    }
  }

  async deleteStudyPlan(idStudyPlan: number): Promise<StudyPlan | null> {
    try {
      if (!idStudyPlan || isNaN(idStudyPlan)) {
        throw new Error("Study plan ID is required and must be a number.");
      }

      const deletedStatus = await this.statusService.getDelete();

      const existingPlan = await prisma.studyPlan.findUnique({
        where: { id: idStudyPlan },
      });

      if (!existingPlan) {
        throw new Error("Study plan not found.");
      }

      const updatedStudyPlan = await prisma.studyPlan.update({
        where: { id: idStudyPlan },
        data: { statusId: deletedStatus.id },
      });

      return updatedStudyPlan;
    } catch (error: any) {
      console.error("Error deleting study plan:", error);
      throw new Error(`Unable to delete the study plan: ${error.message}`);
    }
  }
}

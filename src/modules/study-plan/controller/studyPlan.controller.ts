import { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "../services/studyPlan.service";
import {
  getUserIdOrRespond,
  validateFieldOrRespond,
} from "../../../utils/helpers/helpers.service";

export class StudyPlanController {
  private studyPlanSerive: StudyPlanService;

  constructor() {
    this.studyPlanSerive = new StudyPlanService();
  }

  public async createStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const studyPlanData = req.body;

      if (
        !validateFieldOrRespond(
          studyPlanData,
          res,
          "Missing required values to create the study plan."
        )
      ) {
        return;
      }

      const studyPlanWithUser = { ...studyPlanData, userId };

      const createdStudyPlan = await this.studyPlanSerive.createStudyPlan(
        studyPlanWithUser
      );

      if (!createdStudyPlan) {
        res.status(409).json({
          message: "A study plan already exists for this user.",
        });
        return;
      }

      res.status(201).json({
        message: "Study plan created successfully.",
        studyPlan: createdStudyPlan,
      });
    } catch (error) {
      console.error("Error while creating the study plan:", error);
      res.status(500).json({
        message:
          "An error occurred while creating the study plan. Please try again later.",
      });
    }
  }

  public async getAllStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studyPlanUser = await this.studyPlanSerive.getAllStudyPlan();

      if (!studyPlanUser || studyPlanUser.length === 0) {
        res.status(404).json({
          message: "No study plans found.",
        });
        return;
      }

      res.status(200).json({
        message: "Study plan retrieved successfully.",
        studyPlan: studyPlanUser,
      });
    } catch (error) {
      console.error("Error while retrieving the study plan:", error);
      res.status(500).json({
        message:
          "An error occurred while retrieving the study plan. Please try again later.",
      });
    }
  }
  public async getStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const studyPlanUser = await this.studyPlanSerive.getStudyPlan(
        Number(userId)
      );

      if (!studyPlanUser) {
        res.status(404).json({
          message: "No study plan found for the specified user.",
        });
        return;
      }

      res.status(200).json({
        message: "Study plan retrieved successfully.",
        studyPlan: studyPlanUser,
      });
    } catch (error) {
      console.error("Error while retrieving the study plan:", error);
      res.status(500).json({
        message:
          "An error occurred while retrieving the study plan. Please try again later.",
      });
    }
  }

  public async getOneStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Study plan ID is required." });
        return;
      }

      const idStudyPlan = Number(id);

      if (isNaN(idStudyPlan)) {
        res.status(400).json({ message: "Invalid ID format." });
        return;
      }

      const studyPlan = await this.studyPlanSerive.getOneStudyPlan(idStudyPlan);

      if (!studyPlan) {
        res.status(404).json({ message: "Study plan not found." });
        return;
      }

      res.status(200).json({
        message: "Study plan found successfully.",
        studyPlan: studyPlan,
      });
    } catch (error) {
      console.error("Error getting study plan:", error);
      res.status(500).json({
        message: "Unable to get the study plan. Please try again later.",
      });
    }
  }

  public async updateStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const { id } = req.params;

      if (userId !== id) {
        res.status(403).json({
          message: "You are not authorized to update this study plan.",
        });
        return;
      }

      const studyPlan = req.body;

      if (
        !validateFieldOrRespond(
          studyPlan,
          res,
          "Missing required values to update the study plan."
        )
      ) {
        return;
      }

      const studyPlanUpdate = await this.studyPlanSerive.updateStudyPlan(
        studyPlan
      );

      if (!studyPlanUpdate) {
        res.status(400).json({
          message: "Study plan not found. Unable to update.",
        });
        return;
      }

      res.status(200).json({
        message: "Study plan updated successfully.",
        studyPlan: studyPlanUpdate,
      });
    } catch (error) {
      console.error("Error while updating the study plan:", error);
      res.status(500).json({
        message:
          "An error occurred while updating the study plan. Please try again later.",
      });
    }
  }

  public async deleteStudyPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataStudyPlan = req.body;

      const deletedStatus = await this.studyPlanSerive.deleteStudyPlan(
        dataStudyPlan.id
      );

      if (!deletedStatus) {
        res.status(400).json({
          message:
            "Failed to delete study plan. It may not exist or is already deleted.",
        });
        return;
      }

      res.status(200).json({
        message: "Study plan deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting study plan:", error);
      res.status(500).json({
        message: "An unexpected error occurred while deleting the study plan.",
      });
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "../services/studyPlan.service";
import {
  getUserIdOrRespond,
  validateFieldOrRespond,
} from "../../../utils/helpers/helpers.service";

export class StudyPlanController {
  private studyPlanService = new StudyPlanService();

  public createMyStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const studyPlanData = req.body;

      if (
        !validateFieldOrRespond(
          studyPlanData,
          res,
          "Missing required values to create the study plan."
        )
      )
        return;

      const createdStudyPlan = await this.studyPlanService.createMyStudyPlan({
        ...studyPlanData,
        userId,
      });

      if (!createdStudyPlan) {
        res
          .status(409)
          .json({ message: "A study plan already exists for this user." });
        return;
      }

      res.status(201).json({
        message: "Study plan created successfully.",
        studyPlan: createdStudyPlan,
      });
    } catch (error) {
      console.error("Create StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while creating the study plan.",
      });
    }
  };

  public getMyStudyPlans = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const studyPlan = await this.studyPlanService.getMyStudyPlans(
        Number(userId)
      );

      if (!studyPlan) {
        res.status(404).json({ message: "No study plan found for this user." });
        return;
      }

      res.status(200).json({
        message: "Study plan retrieved successfully.",
        studyPlan,
      });
    } catch (error) {
      console.error("Get StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the study plan.",
      });
    }
  };

  public getMyStudyPlanById = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const studyPlanId = Number(req.params.id);

      if (isNaN(studyPlanId)) {
        res.status(400).json({ message: "Invalid study plan ID." });
        return;
      }

      const studyPlan = await this.studyPlanService.getMyStudyPlanById(
        Number(userId),
        studyPlanId
      );

      if (!studyPlan) {
        res.status(404).json({
          message:
            "Study plan not found or you are not authorized to access it.",
        });
        return;
      }

      res.status(200).json({
        message: "Study plan retrieved successfully.",
        studyPlan,
      });
    } catch (error) {
      console.error("Get My StudyPlan by ID Error:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the study plan.",
      });
    }
  };

  public updateMyStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const studyPlanId = Number(req.params.id);
      const studyPlanData = req.body;

      if (isNaN(studyPlanId)) {
        res.status(400).json({ message: "Invalid study plan ID." });
        return;
      }

      if (
        !validateFieldOrRespond(
          studyPlanData,
          res,
          "Missing required values to update the study plan."
        )
      ) {
        return;
      }

      const updatedStudyPlan =
        await this.studyPlanService.updateMyStudyPlanById(
          Number(userId),
          studyPlanData,
          studyPlanId
        );

      if (!updatedStudyPlan) {
        res.status(404).json({ message: "Study plan not found." });
        return;
      }

      res.status(200).json({
        message: "Study plan updated successfully.",
        studyPlan: updatedStudyPlan,
      });
    } catch (error) {
      console.error("Update My StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while updating the study plan.",
      });
    }
  };

  public deleteMyStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const studyPlanId = Number(req.params.id);

      if (isNaN(studyPlanId)) {
        res.status(400).json({ message: "Invalid study plan ID." });
        return;
      }

      const deleted = await this.studyPlanService.deleteMyStudyPlanById(
        Number(userId),
        studyPlanId
      );

      if (!deleted) {
        res.status(404).json({
          message: "Study plan not found or already deleted.",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Delete My StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while deleting the study plan.",
      });
    }
  };

  public getStudyPlan = async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const studyPlans = await this.studyPlanService.getStudyPlans();

      res.status(200).json({
        message:
          studyPlans && studyPlans.length > 0
            ? "Study plans retrieved successfully."
            : "No study plans found.",
        studyPlans,
      });
    } catch (error) {
      console.error("Get All StudyPlans Error:", error);
      res.status(500).json({
        message: "An error occurred while retrieving study plans.",
      });
    }
  };

  public getStudyPlanById = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!req.params.id || isNaN(id)) {
        res.status(400).json({ message: "Invalid or missing study plan ID." });
        return;
      }

      const studyPlan = await this.studyPlanService.getStudyPlanById(id);

      if (!studyPlan) {
        res.status(404).json({ message: "Study plan not found." });
        return;
      }

      res.status(200).json({
        message: "Study plan retrieved successfully.",
        studyPlan,
      });
    } catch (error) {
      console.error("Get One StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the study plan.",
      });
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "../services/studyPlan.service";
import {
  getUserIdOrRespond,
  validateFieldOrRespond,
} from "../../../utils/helpers/helpers.service";

export class StudyPlanController {
  private studyPlanService = new StudyPlanService();

  public createStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
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
      )
        return;

      const createdStudyPlan = await this.studyPlanService.createStudyPlan({
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

  public getAllStudyPlan = async (
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

  public getStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const studyPlan = await this.studyPlanService.getStudyPlans(
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

  public getOneStudyPlan = async (
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

      const studyPlan = await this.studyPlanService.getOneStudyPlan(id);

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

  public updateStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const paramId = Number(req.params.id);

      if (isNaN(paramId) || Number(userId) !== paramId) {
        res.status(403).json({
          message: "You are not authorized to update this study plan.",
        });
        return;
      }

      const studyPlanData = req.body;

      if (
        !validateFieldOrRespond(
          studyPlanData,
          res,
          "Missing required values to update the study plan."
        )
      ) {
        return;
      }

      const updatedStudyPlan = await this.studyPlanService.updateStudyPlan(
        studyPlanData
      );

      if (!updatedStudyPlan) {
        res.status(404).json({
          message: "Study plan not found.",
        });
        return;
      }

      // Devolver la respuesta con el plan de estudio actualizado
      res.status(200).json({
        message: "Study plan updated successfully.",
        studyPlan: updatedStudyPlan,
      });
    } catch (error) {
      console.error("Update StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while updating the study plan.",
      });
    }
  };

  public deleteStudyPlan = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ message: "Valid study plan ID is required." });
        return;
      }

      const deleted = await this.studyPlanService.deleteStudyPlan(Number(id));

      if (!deleted) {
        res.status(404).json({
          message: "Study plan not found or already deleted.",
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Delete StudyPlan Error:", error);
      res.status(500).json({
        message: "An error occurred while deleting the study plan.",
      });
    }
  };
}

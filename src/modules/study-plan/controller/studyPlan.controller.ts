import { Request, Response, NextFunction } from "express";
import { StudyPlanService } from "../services/studyPlan.service";

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
      const studyPlanData = req.body;

      if (!studyPlanData) {
        res
          .status(400)
          .json({ message: "Faltan valores para crear el plan de estudio" });
        return;
      }

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: "No autorizado" });
        return;
      }

      const studyPlanWithUser = { ...studyPlanData, userId };

      const createdStudyPlan = await this.studyPlanSerive.createStudyPlan(
        studyPlanWithUser
      );

      res.status(201).json({
        message: "Plan de estudio creado correctamente",
        studyPlan: createdStudyPlan,
      });
    } catch (error) {
      console.error("Error al crear el StudyPlan: ", error);
      res.status(500).json({
        message: "Error al crear el plan de estudio. Inténtelo nuevamente.",
      });
    }
  }
}

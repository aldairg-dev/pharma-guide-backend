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
      const studyPlanData = req.body;

      if (
        !validateFieldOrRespond(
          studyPlanData,
          res,
          "Faltan valores para crear el plan de estudio"
        )
      ) {
        return;
      }

      const userId = getUserIdOrRespond(req, res);
      if (!userId) return;

      const studyPlanWithUser = { ...studyPlanData, userId };

      const createdStudyPlan = await this.studyPlanSerive.createStudyPlan(
        studyPlanWithUser
      );

      if (!createdStudyPlan) {
        res.status(409).json({ message: "El plan de estudio ya existe" });
        return;
      }

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
        res.status(404).json({ message: "No se encontró el plan de estudio" });
        return;
      }

      res.status(200).json({
        message: "Plan de estudio obtenido correctamente",
        studyPlan: studyPlanUser,
      });
    } catch (error) {
      console.error("Error al obtener el StudyPlan:", error);
      res.status(500).json({
        message: "Error al obtener el plan de estudio. Inténtelo nuevamente.",
      });
    }
  }
}

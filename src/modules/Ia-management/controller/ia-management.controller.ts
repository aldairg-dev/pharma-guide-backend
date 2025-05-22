import { NextFunction, Request, Response } from "express";
import { IaManagementService } from "../service/ia-management.service";
import { validateFieldOrRespond } from "../../../utils/helpers/helpers.service";

export class ManagementIaController {
  private managementService = new IaManagementService();
  public async createManegemet(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const dataManagement = req.body;
      if (
        !validateFieldOrRespond(
          dataManagement,
          res,
          "Missing required values to create management IA"
        )
      ) {
        return;
      }

      const newManagement = await this.managementService.createManagement(
        dataManagement
      );

      if (!newManagement) {
        res.status(409).json({
          message: "The drug already exists for this user",
        });
        return;
      }

      res.status(201).json(newManagement);
    } catch (error: any) {
      console.error(
        "Error created management ia: ",
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        message: "Error created management ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  public async getManegement(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const managements = await this.managementService.getManagement();

      res.status(200).json({
        data: managements,
      });
    } catch (error: any) {
      console.error(
        "A error ocurred fetching managment IA:",
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        message: "Error getting management: ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  public async getOneManagement(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const managementId = Number(req.params.id);

      if (isNaN(managementId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const management = await this.managementService.getOneMaganegement(
        managementId
      );

      res.status(200).json({
        data: management,
      });
    } catch (error: any) {
      console.error(
        "A error ocurred fetching the management IA :",
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        message: "Error getting the management: ",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

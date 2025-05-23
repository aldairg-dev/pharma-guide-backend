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

  public async updateManagement(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const managementId = Number(req.params.id);
      const dataManagementUpdate = req.body;

      if (!dataManagementUpdate || isNaN(managementId)) {
        res
          .status(400)
          .json({ message: "Invalid management ID or missing update data" });
        return;
      }

      const managementUpdate = await this.managementService.updateManegement(
        managementId,
        dataManagementUpdate
      );

      if (!managementUpdate) {
        res.status(404).json({
          message: "Management not found or update failed",
        });
        return;
      }

      res.status(200).json({
        message: "Management updated successfully",
        data: managementUpdate,
      });
    } catch (error: any) {
      console.error("An error occurred updating management:", error?.message);
      res.status(500).json({
        message: "An error occurred updating management",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  public async deleteManagement(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const managementId = Number(req.params.id);
      if (isNaN(managementId)) {
        res.status(400).json({
          message: "Invalid management ID",
        });
        return;
      }

      const deleteManagement = await this.managementService.deleteManegement(
        managementId
      );
      if (!deleteManagement) {
        res.status(404).json({
          message: "Management not found or could not be deleted",
        });
      }

      res.status(204).send();
    } catch (error: any) {
      console.error(
        "An error occurred deleting management:",
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        message: "An error occurred deleting management",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

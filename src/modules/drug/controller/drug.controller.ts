import { Request, Response, NextFunction } from "express";
import { DrugService } from "../service/drug.service";
import { validateFieldOrRespond } from "../../../utils/helpers/helpers.service";

export class DrugController {
  private drugService = new DrugService();

  // ==================== MÉTODOS PARA USUARIOS AUTENTICADOS (/me/drugs) ====================

  public async createMyDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const dataDrug = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      if (
        !validateFieldOrRespond(
          dataDrug,
          res,
          "Missing required values to create drug"
        )
      )
        return;

      const drugCreated = await this.drugService.createDrug({
        ...dataDrug,
        userId,
      });

      if (!drugCreated) {
        res.status(409).json({
          message: "The drug already exists for this user",
        });
        return;
      }

      res.status(201).json({
        message: "Drug created successfully",
        data: drugCreated,
      });
    } catch (error) {
      console.error(
        "Error creating drug:",
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        message: "Error creating drug:",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  public async getMyDrugs(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const drugUser = await this.drugService.getMyDrugs(userId);

      if (!drugUser || drugUser.length === 0) {
        res.status(404).json({ message: "No drugs found for this user" });
        return;
      }

      res.status(200).json({
        message: "Drugs retrieved successfully",
        data: drugUser,
      });
    } catch (error: any) {
      console.error("An error fetching drugs for user:", error.message);
      res.status(500).json({ message: "Error getting drugs for user" });
    }
  }

  public async getMyDrugById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const drugId = Number(req.params.id);

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      if (isNaN(drugId)) {
        res.status(400).json({ message: "Invalid drug ID" });
        return;
      }

      const drug = await this.drugService.getMyDrugById(Number(userId), drugId);

      if (!drug) {
        res.status(404).json({ 
          message: "Drug not found or you are not authorized to access it." 
        });
        return;
      }

      res.status(200).json({
        message: "Drug retrieved successfully",
        data: drug,
      });
    } catch (error: any) {
      console.error("Error fetching drug:", error.message);
      res.status(500).json({ message: "Error getting drug" });
    }
  }

  public async updateMyDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const dataDrug = req.body;
      const drugId = Number(req.params.id);

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      if (isNaN(drugId)) {
        res.status(400).json({ message: "Invalid drug ID" });
        return;
      }

      if (
        !validateFieldOrRespond(
          dataDrug,
          res,
          "Missing required values to update drug"
        )
      ) {
        return;
      }

      const drugUpdate = await this.drugService.updateMyDrugById(Number(userId), dataDrug, drugId);

      if (!drugUpdate) {
        res.status(404).json({
          message: "Drug not found or could not be updated",
        });
        return;
      }

      res.status(200).json({
        message: "Drug updated successfully",
        data: drugUpdate,
      });
    } catch (error: any) {
      console.error("Error updating drug:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteMyDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const drugId = Number(req.params.id);

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      if (isNaN(drugId)) {
        res.status(400).json({
          message: "Invalid drug ID",
        });
        return;
      }

      const deleted = await this.drugService.deleteMyDrugById(Number(userId), drugId);

      if (!deleted) {
        res.status(404).json({
          message: "Drug not found or already deleted",
        });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      console.error("An error deleting drug:", error.message);
      res.status(500).json({ message: "Error deleting drug" });
    }
  }

  // ==================== MÉTODOS ADMINISTRATIVOS (/users/:id/drugs) ====================

  public async getDrugs(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const drugs = await this.drugService.getDrugs();
      if (!drugs) {
        res.status(404).json({
          message: "No drugs found",
        });
        return;
      }

      res.status(200).json({
        message: "Drugs fetched successfully",
        data: drugs,
      });
    } catch (error: any) {
      console.error("An error occurred fetching drugs: ", error.message);
      res.status(500).json({
        message: "Error getting drugs",
      });
    }
  }

  public async getDrugsByUserId(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const drugs = await this.drugService.getMyDrugs(userId);

      if (!drugs || drugs.length === 0) {
        res.status(404).json({ message: "No drugs found for this user" });
        return;
      }

      res.status(200).json({
        message: "Drugs retrieved successfully",
        data: drugs,
      });
    } catch (error: any) {
      console.error("Error fetching drugs for user:", error.message);
      res.status(500).json({ message: "Error getting drugs for user" });
    }
  }
}

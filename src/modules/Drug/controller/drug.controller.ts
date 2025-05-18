import { Request, Response, NextFunction } from "express";
import { DrugService } from "../service/drug.service";
import { validateFieldOrRespond } from "../../../utils/helpers/helpers.service";

export class DrugController {
  private drugService = new DrugService();

  public async createDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const dataDrug = req.body;

      if (
        !validateFieldOrRespond(
          dataDrug,
          res,
          "Missing required values to create drug"
        )
      )
        return;

      const drugCreated = await this.drugService.createDrug(dataDrug);

      if (!drugCreated) {
        res.status(409).json({
          message: "The drug already exists for this user",
        });
        return;
      }

      res.status(201).json({
        message: "Drug created successfully",
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

  public async getDrugs(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const drugs = await this.drugService.getDrugs();
      if (!drugs) {
        res.status(409).json({
          message: "Not exists drugs",
        });
        return;
      }

      res.status(200).json({
        message: "Drugs fetched successfully",
        data: drugs,
      });
      return;
    } catch (error: any) {
      console.error("An error occurred fetching drugs: ", error.message);
      res.status(500).json({
        message: "Error getting drugs",
      });
      return;
    }
  }

  public async getDrugUser(
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

      const drugUser = await this.drugService.getDrugsByUser(userId);

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

  public async updateDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const dataDrug = req.body;
      const drugId = Number(req.params.id);

      if (isNaN(drugId)) {
        res.status(400).json({ message: "Invalid drug ID" });
        return;
      }

      const drugUpdate = await this.drugService.updateDrug(dataDrug, drugId);

      if (!drugUpdate) {
        res.status(404).json({
          message: "Drug not found or could not be updated",
        });
        return;
      }

      res.status(200).json({ message: "Drug updated successfully" });
    } catch (error: any) {
      console.error("Error updating drug:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteDrug(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const drugId = Number(req.params.id);

      if (isNaN(drugId)) {
        res.status(400).json({
          message: "Invalid drug ID",
        });
        return;
      }

      const deleted = await this.drugService.deleteDrug(drugId);

      if (!deleted) {
        res.status(404).json({
          message: "Drug not found or already deleted",
        });
        return;
      }

      res.status(200).json({ message: "Drug deleted successfully" });
    } catch (error: any) {
      console.error("An error deleting drug:", error.message);
      res.status(500).json({ message: "Error deleting drug" });
    }
  }
}

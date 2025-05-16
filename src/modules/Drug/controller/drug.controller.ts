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
      res.status(500).json({ message: "Error creating drug" });
    }
  }
}

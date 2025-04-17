import { NextFunction, Request, Response } from "express";
import { StatusService } from "../services/status.service";
import {
  getUserIdOrRespond,
  validateFieldOrRespond,
} from "../../../utils/helpers/helpers.service";

export class StatusController {
  private statusService: StatusService;

  constructor() {
    this.statusService = new StatusService();
  }

  public async createStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataStatus = req.body;

      if (
        !validateFieldOrRespond(
          dataStatus,
          res,
          "Missing required fields to create the status."
        )
      ) {
        return;
      }

      const newStatus = await this.statusService.createStatus(dataStatus);

      if (!newStatus) {
        res.status(409).json({
          message: "The status already exists.",
        });
        return;
      }

      res.status(201).json({
        message: "Status created successfully.",
        status: newStatus,
      });
    } catch (error) {
      console.error("Error while creating the status:", error);
      res.status(500).json({
        message: "An error occurred while creating the status.",
      });
    }
  }
}

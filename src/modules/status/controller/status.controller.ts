import { NextFunction, Request, Response } from "express";
import { StatusService } from "../services/status.service";
import { validateFieldOrRespond } from "../../../utils/helpers/helpers.service";

export class StatusController {
  private statusService: StatusService;

  constructor() {
    this.statusService = new StatusService();
  }

  public async createStatus(
    req: Request,
    res: Response,
    _next: NextFunction
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

      res.status(201).json({
        message: "Status created successfully.",
        status: newStatus,
      });
    } catch (error: any) {
      console.error("Error while creating the status:", error);
      if (error.message === "The status already exists.") {
        res.status(409).json({
          message: "The status already exists.",
        });
      } else {
        res.status(500).json({
          message: "An error occurred while creating the status.",
          error: error.message,
        });
      }
    }
  }

  public async getStatus(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const dataStatus = await this.statusService.getStatus();

      if (dataStatus.length === 0) {
        res.status(404).json({
          message: "No status records found.",
        });
        return;
      }

      res.status(200).json({
        status: dataStatus,
      });
    } catch (error: any) {
      console.error("Error while retrieving the status:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the status.",
        error: error.message,
      });
    }
  }

  public async getOneStatus(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const idStatus = parseInt(req.params.id);

      if (isNaN(idStatus) || idStatus <= 0) {
        res.status(400).json({
          message: "Invalid ID format. ID should be a positive number.",
        });
      }

      const dataStatus = await this.statusService.getOneStatus(idStatus);

      if (!dataStatus) {
        res.status(404).json({
          message: `Status with ID ${idStatus} not found.`,
        });
      }

      res.status(200).json({
        message: "Status retrieved successfully.",
        dataStatus: dataStatus,
      });
    } catch (error: any) {
      console.error("Error retrieving status:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the status.",
        error: error.message,
      });
    }
  }

  public async updateStatus(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const idStatus = Number(req.params.id);
      const dataStatus = req.body;

      if (
        !validateFieldOrRespond(
          dataStatus,
          res,
          "Missing required fields to update the status."
        )
      ) {
        return;
      }

      const updatedStatus = await this.statusService.updateStatus(
        idStatus,
        dataStatus
      );

      if (!updatedStatus) {
        res.status(404).json({
          message: `Status with ID ${dataStatus.id} not found or already deleted.`,
        });
        return;
      }

      res.status(200).json({
        message: "Status updated successfully.",
        dataStatus: updatedStatus,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      res.status(500).json({
        message: "An error occurred while updating the status.",
        error: error.message,
      });
    }
  }

  public async deleteStatus(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        res.status(400).json({
          message: "Invalid 'id'. It must be a positive number.",
        });
        return;
      }

      const idNumber = parseInt(id);

      const deletedStatus = await this.statusService.deleteStatus(idNumber);

      if (!deletedStatus) {
        res.status(404).json({
          message: "Status not found or could not be deleted.",
        });
        return;
      }

      res.status(204).json({
        message: "Status successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting status:", error);
      res.status(500).json({
        message: "An unexpected error occurred while deleting the status.",
        error: error.message,
      });
    }
  }
}

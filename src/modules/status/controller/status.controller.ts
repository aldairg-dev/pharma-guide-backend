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

  public async getStatus(
    req: Request,
    res: Response,
    next: NextFunction
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
        message: "Status retrieved successfully.",
        status: dataStatus,
      });
    } catch (error) {
      console.error("Error while retrieving the status:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the status.",
      });
    }
  }

  public async getOneStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idStatus = parseInt(req.params.id);

      const dataStatus = await this.statusService.getOneStatus(idStatus);

      if (!dataStatus) {
        res.status(404).json({
          message: `Status with ID ${idStatus} not found.`,
        });
        return;
      }

      res.status(200).json({
        message: "Status retrieved successfully.",
        dataStatus: dataStatus,
      });
    } catch (error) {
      console.error("Error retrieving status:", error);
      res.status(500).json({
        message: "An error occurred while retrieving the status.",
      });
    }
  }

  public async updateStatus(
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
          "Missing required fields to updated the status."
        )
      ) {
        return;
      }

      const updatedStatus = await this.statusService.updateStatus(dataStatus);

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
    } catch (error) {
      console.error("Error updating status:", error);

      res.status(500).json({
        message: "An error occurred while updating the status.",
      });
    }
  }

  public async deleteStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.body;

      if (
        !validateFieldOrRespond(
          { id },
          res,
          "Missing required field 'id' to delete the status."
        )
      ) {
        return;
      }

      const idNumber = parseInt(id);

      if (isNaN(idNumber) || idNumber <= 0) {
        res.status(400).json({
          message: "Invalid 'id'. It must be a positive number.",
        });
        return;
      }

      const deletedStatus = await this.statusService.deleteStatus(idNumber);

      if (!deletedStatus) {
        res.status(404).json({
          message: `Status not found or could not be deleted.`,
        });
        return;
      }

      res.status(200).json({
        message: `Status deleted successfully.`,
        data: deletedStatus,
      });
    } catch (error) {
      console.error("Error deleting status:", error);
      res.status(500).json({
        message: "An unexpected error occurred while deleting the status.",
      });
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { RoleService } from "../service/role.service";
import {
  getUserIdOrRespond,
  validateFieldOrRespond,
} from "../../../utils/helpers/helpers.service";

export class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public async createRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataRole = req.body;

      if (
        !validateFieldOrRespond(
          dataRole,
          res,
          "Missing required fields to create the Role"
        )
      ) {
        return;
      }

      const newRole = await this.roleService.createRole(dataRole);

      if (!newRole) {
        res.status(409).json({
          message: "Role already exists",
        });
        return;
      }

      res.status(201).json({
        message: "Role created successfully",
        role: newRole,
      });
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public async getRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataRole = await this.roleService.getRole();

      if (!dataRole) {
        res.status(409).json({
          message: "Role not found",
        });
        return;
      }

      res.status(200).json({
        message: "Role found successfully",
        role: dataRole,
      });
    } catch (error) {
      console.log("Error getting role:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public async updateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dataRole = req.body;

      if (
        !validateFieldOrRespond(
          dataRole,
          res,
          "Missing required fields to update the Role"
        )
      ) {
        return;
      }

      const updatedRole = await this.roleService.updateRole(dataRole);

      if (!updatedRole) {
        res.status(409).json({
          message: "Role not found",
        });
        return;
      }

      res.status(200).json({
        message: "Role updated successfully",
        role: updatedRole,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public async deleteRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idRole = req.body.id;
      
      const deletedRole = await this.roleService.deleteRole(idRole);

      if (!deletedRole) {
        res.status(409).json({
          message: "Role not found",
        });
        return;
      }

      res.status(200).json({
        message: "Role deleted successfully",
        role: deletedRole,
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

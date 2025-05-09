import { Request, Response, NextFunction } from "express";
import { RoleService } from "../service/role.service";
import { validateFieldOrRespond } from "../../../utils/helpers/helpers.service";

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
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const roles = await this.roleService.getRole();

      res.status(roles.length > 0 ? 200 : 404).json({
        role: roles.length > 0 ? roles : [],
      });
    } catch (error: any) {
      console.log("Error getting roles:", error);
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  public async updateRole(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const idRole = Number(req.params);
      const dataRole = req.body;

      if (isNaN(idRole) || !dataRole) {
        res.status(400).json({
          message: "Missing required fields to update the Role",
        });
        return;
      }

      const updatedRole = await this.roleService.updateRole(idRole, dataRole);

      res.status(200).json({
        message: "Role updated successfully",
        role: updatedRole,
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  public async deleteRole(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          message: "Missing role ID",
        });
        return;
      }

      const deletedRole = await this.roleService.deleteRole(Number(id));

      res.status(204).json({
        message: "Role deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting role:", error);
      res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}

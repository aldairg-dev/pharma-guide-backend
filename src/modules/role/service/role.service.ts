import { PrismaClient, Role } from "@prisma/client";
import { StatusService } from "../../status/services/status.service";

const prisma = new PrismaClient();

export class RoleService {
  private statusService: StatusService;
  private idActive: number | null = null;
  private idDelete: number | null = null;

  public constructor() {
    this.statusService = new StatusService();
  }

  static async createInstance(): Promise<RoleService> {
    const instance = new RoleService();
    await instance.init();
    return instance;
  }

  private async init(): Promise<void> {
    const statusActive = await this.statusService.getActive();
    if (!statusActive) {
      throw new Error("Active status not found.");
    }
    this.idActive = statusActive.id;

    const statusDelete = await this.statusService.getDelete();
    if (!statusDelete) {
      throw new Error("Active status not found.");
    }
    this.idDelete = statusDelete.id;
  }

  async createRole(role: Role): Promise<Role | null> {
    if (!this.idActive) {
      throw new Error("RoleService not initialized.");
    }

    try {
      if (!role) {
        throw new Error("Role data must be provided.");
      }

      const existingRole = await prisma.role.findUnique({
        where: {
          name: role.name,
          statusId: this.idActive,
        },
      });

      if (existingRole) {
        throw new Error("Role with this name already exists.");
      }

      const newRole = await prisma.role.create({
        data: {
          ...role,
          statusId: this.idActive,
        },
      });

      return newRole;
    } catch (error) {
      console.log("Error creating role:", error);
      throw new Error("Failed to create role.");
    }
  }

  async getRole(): Promise<Role[] | null> {
    if (!this.idActive) {
      throw new Error("RoleService not initialized.");
    }

    try {
      const dataRole = await prisma.role.findMany({
        where: {
          statusId: this.idActive,
        },
      });

      if (!dataRole || dataRole.length === 0) {
        throw new Error("No roles found.");
      }

      return dataRole;
    } catch (error) {
      console.log("Error retrieving roles:", error);
      throw new Error("Failed to retrieve roles.");
    }
  }

  async updateRole(role: Role): Promise<Role | null> {
    if (!this.idActive) {
      throw new Error("RoleService not initialized.");
    }

    try {
      if (!role) {
        throw new Error("Role data must be provided for update.");
      }

      const roleOld = await prisma.role.findUnique({
        where: {
          id: role.id,
          statusId: this.idActive,
        },
      });

      if (!roleOld) {
        throw new Error("Role not found or inactive.");
      }

      const roleUpdate = await prisma.role.update({
        where: { id: roleOld.id },
        data: role,
      });

      return roleUpdate;
    } catch (error) {
      console.log("Error updating role:", error);
      throw new Error("Failed to update role.");
    }
  }

  async deleteRole(idRole: number): Promise<Role | null> {
    try {
      if (!idRole) {
        throw new Error("Role ID must be provided.");
      }

      const role = await prisma.role.findUnique({
        where: {
          id: idRole,
        },
      });

      if (!role) {
        throw new Error("Role not found.");
      }

      const roleDelete = await prisma.role.update({
        where: {
          id: idRole,
        },
        data: {
          statusId: this.idDelete,
        },
      });

      return roleDelete;
    } catch (error) {
      console.log("Error deleting role:", error);
      throw new Error("Failed to delete role.");
    }
  }
}

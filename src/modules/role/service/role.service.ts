import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export class RoleService {
  async createRole(role: Role): Promise<Role | null> {
    try {
      if (!role) {
        throw new Error("Role data must be provided.");
      }

      const exitingRole = await prisma.role.findUnique({
        where: {
          name: role.name,
          statusId: 1,
        },
      });

      if (exitingRole) {
        throw new Error("Role with this name already exists.");
      }

      const newRol = await prisma.role.create({
        data: {
          ...role,
          statusId: 1,
        },
      });

      return newRol;
    } catch (error) {
      console.log("Error creating role:", error);
      throw new Error("Failed to create role.");
    }
  }

  async getRole(): Promise<Role[] | null> {
    try {
      const dataRole = await prisma.role.findMany({
        where: {
          statusId: 1,
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
    try {
      if (!role) {
        throw new Error("Role data must be provided for update.");
      }

      const roleOld = await prisma.role.findUnique({
        where: {
          id: role.id,
          statusId: 1,
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
}

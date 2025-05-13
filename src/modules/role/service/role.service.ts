import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export class RoleService {
  public async getRoleClient(): Promise<Role> {
    const roleClient = await prisma.role.findFirst({
      where: { name: "client" },
    });

    if (!roleClient) {
      throw new Error("Role 'client' does not exist.");
    }

    return roleClient;
  }

  public async createRole(role: Role): Promise<Role> {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (existingRole) {
      throw new Error(`Role "${role.name}" already exists.`);
    }

    return prisma.role.create({
      data: {
        ...role,
        isDeleted: false,
      },
    });
  }

  public async getRole(): Promise<Role[]> {
    return prisma.role.findMany({});
  }

  public async updateRole($idRol: number, $dataRole: Role): Promise<Role> {
    if (isNaN($idRol) || !$dataRole) {
      throw new Error("Both Role ID and Status ID must be provided.");
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: $idRol },
    });

    if (!existingRole) {
      throw new Error(`Role with ID ${$idRol} not found.`);
    }

    return prisma.role.update({
      where: { id: $idRol },
      data: { ...$dataRole },
    });
  }

  public async deleteRole(idRole: number): Promise<Role> {
    if (!idRole) {
      throw new Error("Role ID must be provided for deletion.");
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: idRole },
    });

    if (!existingRole) {
      throw new Error(`Role with ID ${idRole} not found.`);
    }

    return prisma.role.update({
      where: { id: idRole },
      data: { isDeleted: true },
    });
  }
}

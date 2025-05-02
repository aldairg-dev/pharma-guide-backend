import { PrismaClient, Role } from "@prisma/client";
import { StatusService } from "../../status/services/status.service";

const prisma = new PrismaClient();

export class RoleService {
  private statusService = new StatusService();
  private idActive!: number;
  private idDelete!: number;

  public constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const [statusActive, statusDelete] = await Promise.all([
      this.statusService.getActive(),
      this.statusService.getDelete(),
    ]);

    if (!statusActive || !statusDelete) {
      throw new Error("Required statuses (active/delete) not found.");
    }

    this.idActive = statusActive.id;
    this.idDelete = statusDelete.id;
  }

  private ensureInitialized(): void {
    if (!this.idActive || !this.idDelete) {
      throw new Error("RoleService not initialized.");
    }
  }

  public async createRole(role: Role): Promise<Role> {
    this.ensureInitialized();

    if (!role?.name) {
      throw new Error("Role name must be provided.");
    }

    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (existingRole) {
      throw new Error(`Role "${role.name}" already exists.`);
    }

    return prisma.role.create({
      data: {
        ...role,
        statusId: this.idActive,
      },
    });
  }

  public async getRole(): Promise<Role[]> {
    this.ensureInitialized();

    const roles = await prisma.role.findMany({
      where: { statusId: this.idActive },
      include: {
        status: true,
      },
    });

    return roles;
  }

  public async updateRole(role: Role): Promise<Role> {
    this.ensureInitialized();

    if (!role?.id) {
      throw new Error("Role ID must be provided for update.");
    }

    const existingRole = await prisma.role.findUnique({
      where: { id: role.id },
    });

    if (!existingRole || existingRole.statusId !== this.idActive) {
      throw new Error(`Role with ID ${role.id} not found or inactive.`);
    }

    return prisma.role.update({
      where: { id: role.id },
      data: role,
    });
  }

  public async deleteRole(idRole: number): Promise<Role> {
    this.ensureInitialized();

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
      data: { statusId: this.idDelete },
    });
  }
}

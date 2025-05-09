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
    this.ensureInitialized();

    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (existingRole) {
      throw new Error(`Role "${role.name}" already exists.`);
    }

    return prisma.role.create({
      data: {
        ...role,
        statusId: this.idActive, // Asignamos el estado 'activo'
      },
    });
  }

  public async getRole(): Promise<Role[]> {
    this.ensureInitialized();

    return prisma.role.findMany({
      include: { status: true },
    });
  }

  public async updateRole($idRol: number, $dataRole: Role): Promise<Role> {
    this.ensureInitialized();

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

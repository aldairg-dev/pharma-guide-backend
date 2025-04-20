import { Request, Response, NextFunction } from "express";
import { AccessService } from "../services/access.service";

const accessService = new AccessService();

// @author: 2A2G (Aldair Gutierrez Guerrero)
// @description: Controlador para manejar las operaciones de usuarios
// @date: 2023-10-01

export class AccessController {
  private accessService: AccessService;

  constructor() {
    this.accessService = new AccessService();
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;

      if (!userData?.email || !userData?.password) {
        res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const createdUser = await accessService.createUser(userData);

      if (!createdUser) {
        res.status(409).json({ message: "El usuario ya existe" });
      }

      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: createdUser,
      });
    } catch (error) {
      console.error("Error en register:", error);
      res.status(500).json({ message: "Error interno al registrar usuario" });
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await accessService.loginUser(email, password);

      if (!user) {
        res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;

      if (!userData || !userData.id) {
        res.status(400).json({
          message: "Invalid user data. 'id' is required.",
        });
        return;
      }

      const userDataUpdate = await accessService.deleteUser(userData.id);

      if (!userDataUpdate) {
        res.status(404).json({
          message: "User not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        message: "User deleted successfully.",
        data: userDataUpdate,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "An error occurred while deleting the user.",
      });
    }
  }
}

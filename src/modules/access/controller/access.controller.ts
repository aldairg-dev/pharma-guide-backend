import { Request, Response, NextFunction } from "express";
import { AccessService } from "../services/access.service";

export class AccessController {
  private accessService: AccessService;

  constructor() {
    this.accessService = new AccessService();
  }

  public async register(req: Request, res: Response): Promise<Response | void> {
    try {
      const userData = req.body;

      if (!userData?.email || !userData?.full_name) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const createdUser = await this.accessService.createUser(userData);

      if (!createdUser) {
        return res.status(409).json({ message: "El usuario ya existe" });
      }

      return res.status(201).json({
        message: "Usuario registrado correctamente",
        user: createdUser,
      });
    } catch (error: any) {
      console.error("Error en register:", error);
      return res.status(500).json({
        message: "Error interno al registrar usuario",
        error: error?.message || "Detalles no disponibles",
      });
    }
  }

  public async login(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email y password son obligatorios" });
      }

      const user = await this.accessService.loginUser(email, password);

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

// @author: 2A2G (Aldair Gutierrez Guerrero)
// @description: Controlador para manejar las operaciones de usuarios
// @date: 2023-10-01

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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

      const createdUser = await userService.createUser(userData);

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

      const user = await userService.loginUser(email, password);

      if (!user) {
        res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }
}

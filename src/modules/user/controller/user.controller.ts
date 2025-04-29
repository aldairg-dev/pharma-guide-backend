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

      const userDataUpdate = await userService.deleteUser(userData.id);

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

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

  public async getUser(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userData = await userService.getUser();

      if (!userData) {
        res.status(404).json({
          message: "No users found.",
        });
        return;
      }

      res.status(200).json({
        data: userData,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        message: "An error occurred while fetching users.",
      });
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const idUser = parseInt(req.params.idUser, 10);

      if (isNaN(idUser)) {
        res.status(400).json({
          message: "Invalid user ID.",
        });
        return;
      }

      const userData = await userService.getUserById(idUser);

      if (!userData) {
        res.status(404).json({
          message: "User not found.",
        });
        return;
      }

      res.status(200).json({
        message: "User retrieved successfully.",
        data: userData,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        message: "An error occurred while fetching the user.",
      });
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;

      if (!userData || !userData.id) {
        res.status(400).json({
          message: "Invalid user data. 'id' is required.",
        });
        return;
      }

      const userDataUpdate = await userService.updateUser(userData);

      if (!userDataUpdate) {
        res.status(404).json({
          message: "User not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        message: "User updated successfully.",
        data: userDataUpdate,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        message: "An error occurred while updating the user.",
      });
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;

      if (!userData || !userData.idUser) {
        res.status(400).json({
          message: "Invalid user data. 'id' is required.",
        });
      }

      const userDataUpdate = await userService.deleteUser(userData.idUser);

      if (!userDataUpdate) {
        res.status(404).json({
          message: "User not found or already deleted.",
        });
      }

      res.status(204).json({
        message: "User deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        message: "An error occurred while deleting the user.",
        error: error.message,
      });
    }
  }
}

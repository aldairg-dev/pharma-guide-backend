import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

// @author: 2A2G (Aldair Gutierrez Guerrero)
// @description: Controlador para manejar las operaciones de usuarios
// @date: 2025-10-01

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getMyAccount(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Account information retrieved successfully.",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user account:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching account information.",
      });
    }
  }

  public async updateMyAccount(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const userData = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      if (!userData || Object.keys(userData).length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid user data. Body cannot be empty.",
        });
        return;
      }

      const updatedUser = await userService.updateUser(userId, userData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: "User not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Account updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user account:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the account.",
      });
    }
  }

  public async deleteMyAccount(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: "User ID not found in token.",
        });
        return;
      }

      const deletedUser = await userService.deleteUser(userId);

      if (!deletedUser) {
        res.status(404).json({
          success: false,
          message: "User not found or already deleted.",
        });
        return;
      }

      res.status(204).json({
        message: "Account deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the account.",
        error: error.message,
      });
    }
  }


  public async getUsers(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getUser();

      res.status(200).json({
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
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
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the user.",
      });
    }
  }

  public async updateUserById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID. It must be a number.",
        });
        return;
      }

      if (!userData || Object.keys(userData).length === 0) {
        res.status(400).json({
          success: false,
          message: "Invalid user data. Body cannot be empty.",
        });
        return;
      }

      const updatedUser = await userService.updateUser(userId, userData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: "User not found or already deleted.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the user.",
      });
    }
  }

  public async deleteUserById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID. It must be a number.",
        });
      }

      const deletedUser = await userService.deleteUser(userId);

      if (!deletedUser) {
        res.status(404).json({
          success: false,
          message: "User not found or already deleted.",
        });
      }

      res.status(204).json({
        message: "User deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while deleting the user.",
        error: error.message,
      });
    }
  }
}

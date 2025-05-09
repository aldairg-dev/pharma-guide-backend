import { Router } from "express";
import { UserController } from "../controller/user.controller";

const routerUser = Router();
const userController = new UserController();

routerUser.get("/users", userController.getUsers.bind(userController));

routerUser.get("/users/:id", userController.getUserById.bind(userController));

routerUser.put("/users/:id", userController.updateUser.bind(userController));

routerUser.delete("/users/:id", userController.deleteUser.bind(userController));

export default routerUser;

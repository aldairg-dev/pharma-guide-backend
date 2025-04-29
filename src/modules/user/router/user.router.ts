import { Router } from "express";
import { UserController } from "../controller/user.controller";

const routerUser = Router();
const userController = new UserController();

routerUser.get("/users", userController.getUser.bind(userController));
routerUser.get(
  "/users/:idUser",
  userController.getUserById.bind(userController)
);

routerUser.put("/users/:idUser", userController.updateUser.bind(userController));
routerUser.delete("/users", userController.deleteUser.bind(userController));

export default routerUser;

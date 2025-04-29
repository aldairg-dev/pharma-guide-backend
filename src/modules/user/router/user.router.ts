import { Router } from "express";
import { UserController } from "../controller/user.controller";

const routerUser = Router();
const userController = new UserController();

routerUser.get("/user", userController.getUser.bind(userController));
routerUser.get(
  "/user/:idUser",
  userController.getUserById.bind(userController)
);

routerUser.put("/user/:idUser", userController.updateUser.bind(userController));
routerUser.delete("/user", userController.deleteUser.bind(userController));

export default routerUser;

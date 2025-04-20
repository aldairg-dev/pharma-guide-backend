import { Router } from "express";
import { UserController } from "../controller/user.controller";

const routerUser = Router();
const userController = new UserController();

routerUser.delete("/user", userController.deleteUser.bind(userController));

export default routerUser;

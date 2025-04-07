import { Router } from "express";
import { UserController } from "../controller/user.controller";

const routerUser = Router();
const userController = new UserController();

routerUser.post("/register", userController.register.bind(userController));
routerUser.post("/login", userController.login.bind(userController));

export default routerUser;

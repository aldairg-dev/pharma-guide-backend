import { Router } from "express";
import { AccessController } from "../controller/access.controller";

const routerUser = Router();
const userController = new AccessController();


routerUser.post("/register", userController.register.bind(userController));

routerUser.post("/login", userController.login.bind(userController));

export default routerUser;

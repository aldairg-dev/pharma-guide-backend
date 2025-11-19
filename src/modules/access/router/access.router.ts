import { Router } from "express";
import { AccessController } from "../controller/access.controller";

const routerUser = Router();
const controlAccess = new AccessController();

routerUser.post("/register", controlAccess.register.bind(controlAccess));

routerUser.post("/login", controlAccess.login.bind(controlAccess));

export default routerUser;

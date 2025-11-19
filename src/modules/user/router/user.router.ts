import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { DrugController } from "../../drug/controller/drug.controller";

const routerUser = Router();
const userController = new UserController();
const drugController = new DrugController();

routerUser.get("/users", userController.getUsers.bind(userController));

routerUser.get("/users/:id", userController.getUserById.bind(userController));

routerUser.get(
  "/users/:id/drugs",
  drugController.getDrugsByUserId.bind(drugController)
);

routerUser.put("/users/:id", userController.updateUser.bind(userController));

routerUser.delete("/users/:id", userController.deleteUser.bind(userController));

export default routerUser;

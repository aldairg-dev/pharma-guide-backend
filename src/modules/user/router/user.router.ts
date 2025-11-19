import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { DrugController } from "../../drug/controller/drug.controller";
import { StudyPlanController } from "../../study-plan/controller/studyPlan.controller";

const routerUser = Router();
const userController = new UserController();
const drugController = new DrugController();
const studyPlanController = new StudyPlanController();

routerUser.get("/me", userController.getMyAccount.bind(userController));

routerUser.get(
  "/users/study-plans",
  studyPlanController.getStudyPlan.bind(studyPlanController)
);

routerUser.get(
  "/users/:id/drugs",
  drugController.getDrugsByUserId.bind(drugController)
);

routerUser.get("/users", userController.getUsers.bind(userController));

routerUser.get("/users/:id", userController.getUserById.bind(userController));

routerUser.get("/users/:id", userController.getUserById.bind(userController));

routerUser.get("/users/:id", userController.getUserById.bind(userController));

routerUser.put(
  "/users/:id",
  userController.updateUserById.bind(userController)
);

routerUser.delete(
  "/users/:id",
  userController.deleteUserById.bind(userController)
);
export default routerUser;

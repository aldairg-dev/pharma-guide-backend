import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { DrugController } from "../../drug/controller/drug.controller";
import { StudyPlanController } from "../../study-plan/controller/studyPlan.controller";
import { DrugIAController } from "../../drug/controller/drugIA.controller";

const routerUser = Router();
const userController = new UserController();
const drugController = new DrugController();
const studyPlanController = new StudyPlanController();
const drugIAController = new DrugIAController();

routerUser.get("/me", userController.getMyAccount.bind(userController));

routerUser.put("/me", userController.updateMyAccount.bind(userController));

routerUser.delete("/me", userController.deleteMyAccount.bind(userController));

routerUser.post(
  "/me/study-plans",
  studyPlanController.createMyStudyPlan.bind(studyPlanController)
);

routerUser.get(
  "/me/study-plans",
  studyPlanController.getMyStudyPlans.bind(studyPlanController)
);

routerUser.get(
  "/me/study-plans/:id",
  studyPlanController.getMyStudyPlanById.bind(studyPlanController)
);

routerUser.put(
  "/me/study-plans/:id",
  studyPlanController.updateMyStudyPlan.bind(studyPlanController)
);

routerUser.delete(
  "/me/study-plans/:id",
  studyPlanController.deleteMyStudyPlan.bind(studyPlanController)
);

routerUser.post("/me/drugs", drugController.createMyDrug.bind(drugController));

routerUser.get("/me/drugs", drugController.getMyDrugs.bind(drugController));

routerUser.get(
  "/me/drugs/:id",
  drugController.getMyDrugById.bind(drugController)
);

routerUser.put(
  "/me/drugs/:id",
  drugController.updateMyDrug.bind(drugController)
);

routerUser.delete(
  "/me/drugs/:id",
  drugController.deleteMyDrug.bind(drugController)
);

routerUser.get(
  "/me/drugs/:id/contraindications",
  drugIAController.getContraindicationsByDrugId.bind(drugIAController)
);

routerUser.get(
  "/me/drugs/:id/therapeutic-class",
  drugIAController.getTherapeuticClassByDrugId.bind(drugIAController)
);

routerUser.get("/users", userController.getUsers.bind(userController));

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

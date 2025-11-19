import { Router } from "express";
import { RoleController } from "../controller/role.controller";

const routerStudyPlan = Router();
const roleController = new RoleController();

routerStudyPlan.post(
  "/roles", 
  roleController.createRole.bind(roleController));

routerStudyPlan.get(
  "/roles", 
  roleController.getRole.bind(roleController));

routerStudyPlan.put(
  "/roles/:id",
  roleController.updateRole.bind(roleController)
);

routerStudyPlan.delete(
  "/roles/:id",
  roleController.deleteRole.bind(roleController)
);

export default routerStudyPlan;

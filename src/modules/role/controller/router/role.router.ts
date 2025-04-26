import { Router } from "express";
import { RoleController } from "../role.controller";

const routerStudyPlan = Router();
const roleController = new RoleController();

routerStudyPlan.post("/role", roleController.createRole.bind(roleController));

routerStudyPlan.get("/role", roleController.getRole.bind(roleController));

// routerStudyPlan.get(
//   "/role/:id",
//   roleController.getOneStudyPlan.bind(roleController)
// );

routerStudyPlan.put(
  "/role/:id",
  roleController.updateRole.bind(roleController)
);

routerStudyPlan.delete("/role", roleController.deleteRole.bind(roleController));

export default routerStudyPlan;

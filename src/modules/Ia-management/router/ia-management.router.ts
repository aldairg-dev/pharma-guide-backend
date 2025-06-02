import { Router } from "express";
import { ManagementIaController } from "../controller/ia-management.controller";

const routerManagementIA = Router();
const managementIaController = new ManagementIaController();

routerManagementIA.get(
  "/ia-management",
  managementIaController.getManegement.bind(managementIaController)
);

routerManagementIA.post(
  "/ia-management",
  managementIaController.createManegemet.bind(managementIaController)
);

routerManagementIA.get(
  "/ia-management/:id",
  managementIaController.getOneManagement.bind(managementIaController)
);

routerManagementIA.put(
  "/ia-management/:id",
  managementIaController.updateManagement.bind(managementIaController)
);

routerManagementIA.delete(
  "/ia-management/:id",
  managementIaController.deleteManagement.bind(managementIaController)
);

export default routerManagementIA;

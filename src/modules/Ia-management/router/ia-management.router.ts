import { Router } from "express";
import { ManagementIaController } from "../controller/ia-management.controller";

const routerManagementIA = Router();
const managementIaController = new ManagementIaController();

routerManagementIA.get(
  "ia-managemenet",
  managementIaController.getManegement.bind(managementIaController)
);

routerManagementIA.post(
  "ia-management",
  managementIaController.createManegemet.bind(managementIaController)
);

routerManagementIA.get(
  "ia-management/:id",
  managementIaController.getOneManagement.bind(managementIaController)
);

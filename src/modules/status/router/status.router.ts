import { Router } from "express";
import { StatusController } from "../controller/status.controller";

const routerStatus = Router();
const statusController = new StatusController();

routerStatus.post(
  "/status",
  statusController.createStatus.bind(statusController)
);

routerStatus.get("/status", statusController.getStatus.bind(statusController));

routerStatus.get(
  "/status/:id",
  statusController.getOneStatus.bind(statusController)
);

routerStatus.put(
  "/status/:id",
  statusController.updateStatus.bind(statusController)
);

routerStatus.delete(
  "/status/:id",
  statusController.deleteStatus.bind(statusController)
);

export default routerStatus;

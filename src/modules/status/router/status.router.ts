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
  "status/:id",
  statusController.getOneStatus.bind(statusController)
);

routerStatus.put(
  "/status",
  statusController.updateStatus.bind(statusController)
);

export default routerStatus;

import { Router } from "express";
import { StatusController } from "../controller/status.controller";

const routerStatus = Router();
const statusController = new StatusController();

routerStatus.post(
  "/status",
  statusController.createStatus.bind(statusController)
);

export default routerStatus;
